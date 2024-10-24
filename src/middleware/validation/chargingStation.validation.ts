import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {ChargingStation, CreateChargingStation} from "../../../types.js";
import chargingStationRepo from "../../repos/chargingStation.repo.js";
import ChargingStationRepo from "../../repos/chargingStation.repo.js";

class chargingStationValidation extends Validation {
    constructor() {
        super("charging_station");
    }

    //when adding, charging station type has to be empty and there cant be another charging station with the same ip nor deviceId
    createAction = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body as CreateChargingStation;
        if (data.chargingStationTypeId) {
            throw new Error("You can't add charging station type before adding proper amount of connectors")
        }

        const stationsWithTheSameIp = await chargingStationRepo.get({ipAddress: data.ipAddress})
        const stationsWithTheSameDeviceId = await chargingStationRepo.get({deviceId: data.deviceId})

        if (stationsWithTheSameIp.length > 0)
            throw new Error("Station with provided ip already exists")

        if (stationsWithTheSameDeviceId.length > 0)
            throw new Error("Station with provided device id already exists")

        next()
    }

    updateAction = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        //cant update type if the current type is not null
        const update = req.body as ChargingStation
        if (!update.chargingStationTypeId) {
            return next()
        }

        const prev = await ChargingStationRepo.getById(id)
        if (prev.chargingStationTypeId){
            throw new Error("You cant update charging station type. You have to delete it first, update the amount of connectors and add new charging station type")
        }

        return next()
    }
}

export default new chargingStationValidation();