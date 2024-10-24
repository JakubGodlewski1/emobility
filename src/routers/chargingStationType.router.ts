import {Router} from "express";
import ChargingStationTypeController from "../controllers/chargingStationType.controller.js";
import chargingStationTypeValidation from "../middleware/validation/chargingStationType.validation.js";

export const chargingStationTypeRouter = Router();

const {create, update, getById, get, deleteById} = ChargingStationTypeController

const {
    createBody:validateCreateBody,
    id: validateId
} = chargingStationTypeValidation


chargingStationTypeRouter.get("/:id", validateId, getById)
chargingStationTypeRouter.get("/", get)
chargingStationTypeRouter.post("/", validateCreateBody, create)
chargingStationTypeRouter.put("/:id", validateId, update)
chargingStationTypeRouter.delete("/:id",validateId, deleteById)