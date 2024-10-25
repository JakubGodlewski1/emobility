import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {CreateConnector, Summary} from "../../../types.js";
import {BadRequestError} from "../../errors/customErrors.js";
import Repo from "../../repos/base.repo.js";
import ConnectorRepo from "../../repos/connector.repo.js";

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

        const isTypeSpecified = !!summary.plugCount
        if (isTypeSpecified) {
            throw new BadRequestError("You can't add the connector to charging station with specified type")
        }

        if (summary.connectorsWithPriority && summary.connectorsWithPriority > 0 && connector.priority) {
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