import {Router} from "express";
import ChargingStationTypeController from "../controllers/chargingStationType.controller.js";

export const chargingStationTypeRouter = Router();

const {create} = ChargingStationTypeController

chargingStationTypeRouter.post("/", create)