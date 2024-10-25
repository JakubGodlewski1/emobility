import "express-async-errors"
import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan"
import helmet from "helmet";
import {routerV1} from "./routers/index.js";
import {errorHandler} from "./errors/errorHandler.js";
import {StatusCodes} from "http-status-codes";
import {Reply} from "../types.js";
import logger from "./config/logger.js";

//app init
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`, { context: 'request' });
    next();
});

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//routers
app.use("/api/v1",routerV1)

//no found route
app.use("/*", (req:Request, res:Response)=>{
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error:"Endpoint does not exist"
    } as Reply)
})

//error handler
app.use(errorHandler)


export default app;