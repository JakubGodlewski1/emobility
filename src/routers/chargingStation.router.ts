import {Router} from 'express';
import chargingStationController from "../controllers/chargingStation.controller.js";
import chargingStationValidation from "../middleware/validation/chargingStation.validation.js";

export const chargingStationRouter = Router();

const {getById, update, create, get, deleteById: deleteStation} = chargingStationController
const {
    id: validateId,
    elExists,
    getBody: validateGetBody,
    createBody: validateCreateBody,
    updateBody: validateUpdateBody,
    createAction: validateCreateAction,
    updateAction: validateUpdateAction,
} = chargingStationValidation;

chargingStationRouter.get("/:id", validateId, elExists, getById)
chargingStationRouter.get("/", validateGetBody, get)
chargingStationRouter.post("/", validateCreateBody, validateCreateAction, create)
chargingStationRouter.put("/:id", validateId, elExists, validateUpdateBody, validateUpdateAction,update)
chargingStationRouter.delete("/:id", validateId, elExists, deleteStation)