import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { ServicesRoutes } from "../modules/service/service.route";
import { SlotRoutes } from "../modules/slot/slot.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { AuthRoutes } from "../modules/auth/auth.route";

import { reviewRoutes } from "../modules/review/review.route";
import { cartRoute } from "../modules/cart/cart.route";
import { paymentRoute } from "../modules/payment/payment.route";

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

  {
    path: "/api",
    route: reviewRoutes,
  },
  {
    path: "/api",
    route: cartRoute,
  },
  {
    path: "/api",
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
