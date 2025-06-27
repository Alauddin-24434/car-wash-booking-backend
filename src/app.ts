import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from 'cookie-parser';
import { Service } from "./app/modules/service/service.model";
import { Slot } from "./app/modules/slot/slot.model";
import { Booking } from "./app/modules/Booking/booking.model";
import { Payment } from "./app/modules/payment/payment.model";
import { User } from "./app/modules/user/user.model";

const app: Application = express();


//parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ['https://car-wash-booking-seven.vercel.app','http://localhost:3000'], credentials: true }));

// application routes
app.use("/", router);



app.get("/api/dashboard/admin", async (req: Request, res: Response) => {
  try {
    // === ১. সার্ভিস সম্পর্কিত স্ট্যাটস
    const totalServices = await Service.countDocuments();

    const services = await Service.aggregate([
      {
        $lookup: {
          from: "slots",
          localField: "_id",
          foreignField: "serviceId",
          as: "slots",
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "serviceId",
          as: "bookings",
        },
      },
      {
        $addFields: {
          totalSlots: { $size: "$slots" },
          totalBookings: { $size: "$bookings" },
          totalCapacity: { $sum: "$slots.capacity" },
          totalBooked: { $sum: "$slots.booked" },
          totalAvailable: { $sum: "$slots.available" },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          totalSlots: 1,
          totalBookings: 1,
          totalCapacity: 1,
          totalBooked: 1,
          totalAvailable: 1,
        },
      },
    ]);

    // === ২. স্লট সম্পর্কিত স্ট্যাটস (status অনুসারে)
    const slotStatsByStatus = await Slot.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
          totalBooked: { $sum: "$booked" },
          totalAvailable: { $sum: "$available" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          totalCapacity: 1,
          totalBooked: 1,
          totalAvailable: 1,
        },
      },
    ]);

    const totalSlots = await Slot.countDocuments();

    // === ৩. বুকিং ও পেমেন্ট সম্পর্কিত স্ট্যাটস
    const totalBookings = await Booking.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today } });

    const paymentAggregation = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: "$amount" },
          pendingPayments: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0],
            },
          },
        },
      },
    ]);
    const totalPaidAmount = paymentAggregation[0]?.totalPaidAmount || 0;
    const pendingPayments = paymentAggregation[0]?.pendingPayments || 0;

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              "$_id",
            ],
          },
          amount: 1,
          _id: 0,
        },
      },
    ]);

    // === ৪. ইউজার ও ক্লায়েন্ট স্ট্যাটস
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const newRegistrations = await User.aggregate([
      {
        $group: {
          _id: { $isoWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          week: { $concat: ["2025-W", { $toString: "$_id" }] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    // === ৫. অন্যান্য স্ট্যাটস
    const topBookers = await Booking.aggregate([
      { $group: { _id: "$userId", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          name: "$user.name",
          bookings: 1,
          _id: 0,
        },
      },
    ]);

    const serviceRatings = await Service.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "serviceId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $project: {
          serviceId: "$_id",
          avgRating: 1,
          reviewCount: 1,
          _id: 0,
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 1 },
    ]);

    const dailyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          bookings: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
      { $limit: 30 },
    ]);

    const peakHours = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          hour: {
            $concat: [
              { $toString: "$_id" },
              ":00 - ",
              { $toString: { $add: ["$_id", 1] } },
              ":00",
            ],
          },
          bookings: 1,
          _id: 0,
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]);

    const weeklyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $isoWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          week: { $concat: ["W", { $toString: "$_id" }] },
          bookings: "$count",
          _id: 0,
        },
      },
      { $sort: { week: 1 } },
      { $limit: 8 },
    ]);

    const bookingsByWeekday = await Booking.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          day: {
            $arrayElemAt: [
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              { $subtract: ["$_id", 1] },
            ],
          },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const returningVsNew = await Booking.aggregate([
      { $group: { _id: "$userId", bookings: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          newUsers: { $sum: { $cond: [{ $eq: ["$bookings", 1] }, 1, 0] } },
          returningUsers: { $sum: { $cond: [{ $gt: ["$bookings", 1] }, 1, 0] } },
        },
      },
      { $project: { _id: 0, newUsers: 1, returningUsers: 1 } },
    ]);

    const paymentMethodStats = await Booking.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          method: "$_id",
          count: 1,
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);

    const cancelledBookings = await Booking.aggregate([
      { $match: { status: "cancelled" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { date: -1 } },
      { $limit: 7 },
    ]);

    // === ডাইনামিক adminStats হিসাবের জন্য আগের মাসের ডেটা নেওয়া
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // আগের মাসের ইউজার সংখ্যা
    const prevUsersCount = await User.countDocuments({ createdAt: { $lt: oneMonthAgo } });
    // আগের মাসের বুকিং সংখ্যা
    const prevBookingsCount = await Booking.countDocuments({ createdAt: { $lt: oneMonthAgo } });
    // আগের মাসের মোট আয়
    const prevPaymentAggregation = await Payment.aggregate([
      { $match: { createdAt: { $lt: oneMonthAgo } } },
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: "$amount" },
        },
      },
    ]);
    const prevTotalRevenue = prevPaymentAggregation[0]?.totalPaidAmount || 0;

    // পার্সেন্টেজ চেঞ্জ হিসাব
    const usersChange = prevUsersCount ? ((totalUsers - prevUsersCount) / prevUsersCount) * 100 : 0;
    const bookingsChange = prevBookingsCount ? ((totalBookings - prevBookingsCount) / prevBookingsCount) * 100 : 0;
    const revenueChange = prevTotalRevenue ? ((totalPaidAmount - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        // ফ্ল্যাট স্ট্যাটস
        totalRevenue: totalPaidAmount,
        revenueChange: +revenueChange.toFixed(2),
        totalUsers,
        usersChange: +usersChange.toFixed(2),
        totalBookings,
        bookingsChange: +bookingsChange.toFixed(2),
        totalServices,
        servicesChange: 2.1, // তোমার লজিক অনুযায়ী চাইলে যোগ করো

        // আগের ডেটা
        serviceStats: { totalServices, services },
        slotStats: { totalSlots, slotStatsByStatus },
        bookingStats: {
          totalBookings,
          todayBookings,
          totalPaidAmount,
          pendingPayments,
          monthlyRevenue,
        },
        userStats: {
          totalUsers,
          activeUsers,
          newRegistrations,
          topBookers,
        },
        ratingStats: {
          serviceRatings,
          topRatedService: serviceRatings[0] || null,
        },
        analytics: {
          dailyBookings,
          peakHours,
          weeklyBookings,
          bookingsByWeekday,
          returningVsNew: returningVsNew[0] || { newUsers: 0, returningUsers: 0 },
          paymentMethodStats,
          cancelledBookings,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to load dashboard data", error: error.message });
  }
});





app.get("/", (req: Request, res: Response) => {
  res.send("server is running on 5000");
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
