import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";
import {validateTableNames} from "../utils/ValidateTableNames.js";
import stationRepo from "../repos/chargingStation.repo.js";
import connectorRepo from "../repos/connector.repo.js";
import {InternalError} from "../errors/customErrors.js";
import stationTypeRepo from "../repos/chargingStationType.repo.js";
import {Reply, TableName} from "../../types.js";

const TABLES_REPOS_MAP: Record<TableName, typeof connectorRepo | typeof stationRepo | typeof stationTypeRepo> = {
    connector: connectorRepo,
    charging_station: stationRepo,
    charging_station_type: stationTypeRepo,
}

export default class Controller<T extends Record<string, any>> {
    tableName: TableName;
    repo: typeof connectorRepo | typeof stationRepo | typeof stationTypeRepo

    constructor(tableName: TableName) {
        validateTableNames(tableName)
        this.repo = TABLES_REPOS_MAP[tableName]

        this.tableName = tableName;
    }

    getById = async (req: Request, res: Response) => {
        const {id} = req.params
        const el = await this.repo.getById(id)

        const reply: Reply = {success: true, data: el}
        res.status(StatusCodes.OK).json(reply)
    }

    get = async (req: Request, res: Response) => {
        const queries = req.query as Partial<T>
        const elements = await this.repo.get(queries)

        const reply: Reply = {
            success: true,
            data: elements,
        }

        res.status(StatusCodes.OK).json(reply)
    }

    deleteById = async (req: Request, res: Response) => {
        const {id} = req.params
        const deletedEl = await this.repo.deleteById(id)

        const reply: Reply = {success: true, data: deletedEl}
        res.status(StatusCodes.OK).json(reply)
    }

    create = async (req: Request, res: Response) => {
        const el = req.body
        const newEl = await this.repo.insert(el)
        console.log({newEl})
        if (!newEl) {
            throw new InternalError("We could not create a new element, try again later")
        }
        const reply: Reply = {success: true, data: newEl}
        res.status(StatusCodes.CREATED).json(reply)
    }

    update = async (req: Request, res: Response) => {
        const {id} = req.params
        const update = req.body
        const updatedEl = await this.repo.update(id, update)

        const reply: Reply = {
            success: true,
            data: updatedEl
        }

        res.status(200).json(reply)
    }
}