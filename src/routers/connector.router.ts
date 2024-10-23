import { Router } from 'express';
import ConnectorController from "../controllers/connector.controller.js";

export const connectorRouter = Router();

const {get} = ConnectorController

connectorRouter.get('/', get)