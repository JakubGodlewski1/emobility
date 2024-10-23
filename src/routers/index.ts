import {Router} from 'express';
import {authRouter} from "./auth.router.js";

export const routerV1 = Router();

routerV1.use("/auth", authRouter)