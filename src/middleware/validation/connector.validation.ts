import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {Connector, CreateConnector, Summary} from "../../../types.js";
import {BadRequestError} from "../../errors/customErrors.js";
import Repo from "../../repos/base.repo.js";
import ConnectorRepo from "../../repos/connector.repo.js";
import ChargingStationRepo from "../../repos/chargingStation.repo.js";

class ConnectorValidation extends Validation {
    constructor() {
        super("connector");
    }

    //when adding, make sure that charging station has not specified its type and that there is no more than 1 connector with
    //priority hooked up to the station
    createAction = async (req: Request, res: Response, next: NextFunction) => {
        const connector = req.body as CreateConnector;

        if (!connector.chargingStationId) {
            return next()
        }

        const summary: Summary = await Repo.getSummary(connector.chargingStationId)

        if (summary.plugCount) {
            throw new BadRequestError("You can't add the connector to charging station that has a specified type")
        }

        if (summary.connectorsWithPriority && summary.connectorsWithPriority > 0 && connector.priority) {
            throw new Error("Charging station can handle only one connector with priority")
        }

        next()
    }

    updateAction = async (req: Request, res: Response, next: NextFunction) => {
        const update = req.body as Partial<CreateConnector>;
        const id = req.params.id
        const connector = await ConnectorRepo.getById(id) as Connector

        if (!update.chargingStationId && !connector.chargingStationId){
            return next()
        }

        //if connector has a new charging station id, validate that the charging station does not have type
        if (update.chargingStationId){
            const chargingStation = await ChargingStationRepo.getById(update.chargingStationId)
            if (!chargingStation){
                throw new BadRequestError("charging station with provided id does not exist")
            }

            if (chargingStation.chargingStationTypeId){
                throw new BadRequestError("You can't add the connector to charging station with specified type")
            }
        }


        //validate the amount of connectors with priority
        if (!update.priority){
            return next()
        }

        const currentChargingStationId = update.chargingStationId || connector.chargingStationId!

        const summary:Summary = await Repo.getSummary(currentChargingStationId)
        if (summary.connectorsWithPriority && summary.connectorsWithPriority > 0) {
            throw new Error("Charging station can handle only one connector with priority")
        }

        next()
    }

    //when deleting, make sure that the connector is not connected to any charging station
    deleteAction = async (req: Request, res: Response, next: NextFunction) => {
        //cant delete a connector if the charging station has specified type
        const id = req.params.id;

        const connector = await ConnectorRepo.getById(id)
        if (!connector.chargingStationId)
            return next()

        const summary: Summary = await Repo.getSummary(connector.chargingStationId)
        if (summary.plugCount) {
            throw new BadRequestError("You cant delete a connector that is connected to charging station with specified type")
        }

        return next()
    }
}

export default new ConnectorValidation();