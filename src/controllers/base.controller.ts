import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";
import {validateTableNames} from "../utils/ValidateTableNames.js";
import connectorRepo from "../repos/connector.repo.js";
import chargingStationTypeRepo from "../repos/chargingStationType.repo.js";
import {Reply, TableName} from "../../types.js";
import chargingStationRepo from "../repos/chargingStation.repo.js";

const TABLES_REPOS_MAP: Record<TableName, typeof connectorRepo | typeof chargingStationRepo | typeof chargingStationTypeRepo> = {
    connector: connectorRepo,
    charging_station: chargingStationRepo,
    charging_station_type: chargingStationTypeRepo,
}

export default class Controller<T extends Record<string, any>> {
    private repo: typeof connectorRepo | typeof chargingStationRepo | typeof chargingStationTypeRepo

    constructor(tableName: TableName) {
        validateTableNames(tableName)
        this.repo = TABLES_REPOS_MAP[tableName]
    }

    getById = async (req: Request, res: Response) => {
        const {id} = req.params
        const el = await this.repo.getById(id)


        const reply: Reply = {success: true, data: el}
        res.status(StatusCodes.OK).json(reply)
    }

    get = async (req: Request, res: Response) => {
        const { limit, offset, ...filters } = req.query as Partial<T> & { limit?: string; offset?: string };

        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        const parsedOffset = offset ? parseInt(offset, 10) : 0;

        const elements = await this.repo.get(filters, { limit: parsedLimit, offset: parsedOffset });

        const reply: Reply = { success: true, data: elements };
        res.status(StatusCodes.OK).json(reply);
    };

    deleteById = async (req: Request, res: Response) => {
        const {id} = req.params
        const deletedEl = await this.repo.deleteById(id)

        const reply: Reply = {success: true, data: deletedEl}
        res.status(StatusCodes.OK).json(reply)
    }

    create = async (req: Request, res: Response) => {
        const el = req.body
        const newEl = await this.repo.insert(el)

        const reply: Reply = {success: true, data: newEl}
        res.status(StatusCodes.CREATED).json(reply)
    }

    update = async (req: Request, res: Response) => {
        const {id} = req.params
        const update = req.body
        const updatedEl = await this.repo.update(id, update)

        const reply: Reply = {success: true, data: updatedEl}
        res.status(200).json(reply)
    }
}