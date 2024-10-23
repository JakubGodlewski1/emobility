import {Router} from 'express';
import {authRouter} from "./auth.router.js";
import {connectorRouter} from "./connector.router.js";
import AuthValidation from "../middleware/validation/auth.validation.js";

export const routerV1 = Router();

const {validateAccessToken} = AuthValidation

routerV1.use("/auth", authRouter)
routerV1.use("/connectors", validateAccessToken, connectorRouter)