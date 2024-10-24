import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../errors/customErrors.js";
import chargingStationRepo from "../../repos/chargingStation.repo.js";
import {ChargingStationType} from "../../../types.js";
import ChargingStationTypeRepo from "../../repos/chargingStationType.repo.js";
import ChargingStationRepo from "../../repos/chargingStation.repo.js";

class ChargingStationTypeValidation extends Validation {
    constructor() {
        super("charging_station_type");
    }

    //when deleting, make sure no charging station has its type
    deleteAction = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        const chargingStation = await chargingStationRepo.get({chargingStationTypeId: id})
        if (chargingStation.length > 0) {
            throw new BadRequestError(`You cant delete the type because the type is being used by ${chargingStation.length} charging stations`)
        }

        return next()
    }

    updateAction = async (req: Request, res: Response, next: NextFunction) => {
        //cant update plug_count if any charging station is pointing to the type
        const id = req.params.id
        const update = req.body as Partial<ChargingStationType>
        if (!update.plugCount){
            return next()
        }

        const prevType = await ChargingStationTypeRepo.getById(id)
        if (prevType.plugCount===update.plugCount){
           return next()
        }

        const chargingStationsWithGivenType =await ChargingStationRepo.get({chargingStationTypeId: id})
        if (chargingStationsWithGivenType.length>0){
            throw new BadRequestError("You can't update plug_count if any charging station is using this type")
        }

       return next()
    }
}

export default new ChargingStationTypeValidation();