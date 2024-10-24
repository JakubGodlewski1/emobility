import {Router} from "express";
import ChargingStationTypeController from "../controllers/chargingStationType.controller.js";
import chargingStationTypeValidation from "../middleware/validation/chargingStationType.validation.js";

export const chargingStationTypeRouter = Router();

const {create, update, getById, get, deleteById} = ChargingStationTypeController

const {
    id: validateId,
    elExists,
    getBody: validateGetBody,
    createBody: validateCreateBody,
    updateBody: validateUpdateBody,
    updateAction: validateUpdateAction,
    deleteAction: validateDeleteAction,

} = chargingStationTypeValidation;

chargingStationTypeRouter.get("/:id", validateId, elExists, getById)
chargingStationTypeRouter.get("/", validateGetBody, get)
chargingStationTypeRouter.post("/", validateCreateBody, create)
chargingStationTypeRouter.put("/:id", validateId, elExists, validateUpdateBody, validateUpdateAction, update)
chargingStationTypeRouter.delete("/:id", validateId, elExists, validateDeleteAction, deleteById)
