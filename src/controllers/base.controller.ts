import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";

export default class BaseController {
    tableName;

    constructor(tableName:TableName){
        this.tableName = tableName
    }

    get = (req: Request, res: Response) => {
        const reply:Reply = {
            success:true,
            data:["el"]
        }

        res.status(StatusCodes.OK).json(reply)
    }
}