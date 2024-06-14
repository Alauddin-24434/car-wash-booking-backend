import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { ServicesRoutes } from "../modules/service/service.route";
import { SlotRoutes } from "../modules/slot/slot.route";


const router= Router();

const moduleRoutes=[
    {
        path: '/api',
        route: userRoutes,
      },
    {
        path: '/api',
        route: ServicesRoutes,
      },
    {
        path: '/api',
        route: SlotRoutes,
      },
]



moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
