import {Router} from 'express';
import {authRouter} from "./auth.router.js";
import {connectorRouter} from "./connector.router.js";
import AuthValidation from "../middleware/validation/auth.validation.js";
import {chargingStationTypeRouter} from "./chargingStationType.router.js";
import {chargingStationRouter} from "./chargingStation.router.js";

export const routerV1 = Router();

const {validateAccessToken} = AuthValidation

routerV1.use("/auth", authRouter)
routerV1.use("/connectors", validateAccessToken, connectorRouter)
routerV1.use("/charging-station-types",validateAccessToken, chargingStationTypeRouter)
routerV1.use("/charging-stations", validateAccessToken,chargingStationRouter)