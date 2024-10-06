import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
const app: Application = express();


//parsers
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ origin: ['https://car-wash-booking-services.vercel.app','http://localhost:5173'], credentials: true }));

// application routes
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running on 5000");
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
