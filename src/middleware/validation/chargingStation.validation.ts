import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {CreateChargingStation} from "../../../types.js";
import chargingStationRepo from "../../repos/chargingStation.repo.js";
import ChargingStationRepo from "../../repos/chargingStation.repo.js";
import ChargingStationTypeRepo from "../../repos/chargingStationType.repo.js";
import ConnectorRepo from "../../repos/connector.repo.js";
import {BadRequestError} from "../../errors/customErrors.js";

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
        const update = req.body as Partial<CreateChargingStation>
        const chargingStation = await ChargingStationRepo.getById(id)

        //if there is no charging station type id in neither update nor current charging station, then call next.
        //also if update includes chargingStationTypeId = null, just go next
        if ((!update.chargingStationTypeId && !chargingStation.chargingStationTypeId) || update.chargingStationTypeId===null){
            return next()
        }

        //otherwise, validate that charging station type has the same ammount of connectors as the type plug_count
        const currentChargingStationTypeId = update.chargingStationTypeId || chargingStation.chargingStationTypeId!
        const chargingStationType = await ChargingStationTypeRepo.getById(currentChargingStationTypeId)

        const numberOfConnectors = await ConnectorRepo.get({chargingStationId: id})

        if (numberOfConnectors.length !== chargingStationType.plugCount){
            throw new BadRequestError("The amount of connectors on charging station does not equal to plug count on the type")
        }

        next()
    }
}

export default new chargingStationValidation();