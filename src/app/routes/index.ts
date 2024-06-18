import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { ServicesRoutes } from "../modules/service/service.route";
import { SlotRoutes } from "../modules/slot/slot.route";
import { BookingRoutes } from "../modules/Booking/booking.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/api",
    route: userRoutes,
  },
  {
    path: "/api",
    route: ServicesRoutes,
  },
  {
    path: "/api",
    route: SlotRoutes,
  },
  {
    path: "/api",
    route: BookingRoutes,
  },
  {
    path: "/api",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
