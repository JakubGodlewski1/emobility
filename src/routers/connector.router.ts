import {Router} from 'express';
import ConnectorController from "../controllers/connector.controller.js";
import connectorValidation from "../middleware/validation/connector.validation.js";

export const connectorRouter = Router();

const {getById, update, create, get, deleteById: deleteStation} = ConnectorController

const {
    id: validateId,
    elExists,
    getBody: validateGetBody,
    createBody: validateCreateBody,
    updateBody: validateUpdateBody,
    createAction: validateCreateAction,
    deleteAction: validateDeleteAction,
} = connectorValidation;

connectorRouter.get("/:id", validateId, elExists, getById)
connectorRouter.get("/", validateGetBody, get)
connectorRouter.post("/", validateCreateBody, validateCreateAction, create)
connectorRouter.put("/:id", validateId, elExists, validateUpdateBody, update)
connectorRouter.delete("/:id", validateId, elExists, validateDeleteAction, deleteStation)