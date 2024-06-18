"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const service_route_1 = require("../modules/service/service.route");
const slot_route_1 = require("../modules/slot/slot.route");
const booking_route_1 = require("../modules/Booking/booking.route");
const auth_route_1 = require("../modules/auth/auth.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/api",
        route: user_route_1.userRoutes,
    },
    {
        path: "/api",
        route: service_route_1.ServicesRoutes,
    },
    {
        path: "/api",
        route: slot_route_1.SlotRoutes,
    },
    {
        path: "/api",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/api",
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
