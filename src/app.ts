import "express-async-errors"
import express from "express";
import morgan from "morgan"
import helmet from "helmet";
import {routerV1} from "./routers/index.js";
import {errorHandler} from "./errors/errorHandler.js";

//app init
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//routers
app.use("/api/v1",routerV1)

//no found route

//error handler
app.use(errorHandler)


export default app;