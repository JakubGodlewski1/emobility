import {NextFunction} from "express";
import {BadRequestError} from "../../errors/customErrors.js";
import {uuidRegex} from "../../utils/uuidRegex.js";
import {z} from "zod";
import {validateBody} from "./helpers/validateBody.js";
import connectorRepo from "../../repos/connector.repo.js";
import {validateTableNames} from "../../utils/ValidateTableNames.js";
import {Request, Response} from "express";
import {TableName} from "../../../types.js";
import chargingStationTypeRepo from "../../repos/chargingStationType.repo.js";
import chargingStationRepo from "../../repos/chargingStation.repo.js";
import ConnectorValidator from "../../validators/connector.validator.js";
import ChargingStationValidator from "../../validators/chargingStation.validator.js";
import ChargingStationTypeValidator from "../../validators/chargingStationType.validator.js";

const TABLES_REPOS_MAP: Record<TableName, typeof connectorRepo | typeof chargingStationRepo | typeof chargingStationTypeRepo> = {
    connector: connectorRepo,
    charging_station: chargingStationRepo,
    charging_station_type: chargingStationTypeRepo,
}

const VALIDATOR_MAP: Record<TableName, Record<"create" | "update" | "get", z.ZodObject<any>>> = {
    connector: {
        create: ConnectorValidator.create,
        update: ConnectorValidator.update,
        get: ConnectorValidator.get,
    },
    charging_station: {
        create: ChargingStationValidator.create,
        update: ChargingStationValidator.update,
        get: ChargingStationValidator.get,
    },
    charging_station_type: {
        create: ChargingStationTypeValidator.create,
        update: ChargingStationTypeValidator.update,
        get: ChargingStationTypeValidator.get
    }
}

export default class Validation {
    tableName
    repo;

    constructor(tableName: TableName) {

        validateTableNames(tableName)
        this.repo = TABLES_REPOS_MAP[tableName]
        this.tableName = tableName;
    }

    id = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        //check if id exists
        if (!id) throw new BadRequestError("Id is not provided");

        //check if id has proper format
        if (!uuidRegex.test(id)) {
            throw new BadRequestError(`Id ${id} is not a valid uuid`);
        }

        next()
    }
    updateBody = async (req: Request, res: Response, next: NextFunction) => {
        validateBody(VALIDATOR_MAP[this.tableName].update, req.body)
        next()
    }

    getBody = async (req: Request, res: Response, next: NextFunction) => {
        const queries = req.query
        validateBody(VALIDATOR_MAP[this.tableName].get, queries)
        next()
    }

    createBody = async (req: Request, res: Response, next: NextFunction) => {
        validateBody(VALIDATOR_MAP[this.tableName].create, req.body)
        next()
    }

    elExists = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        if (!id) throw new BadRequestError("Id is not provided");
        const element = await this.repo.getById(id)
        if (!element) {
            throw new BadRequestError("Element with given id does not exist")
        }
        next()
    }
}