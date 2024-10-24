import Validation from "./base.validation.js";
import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../errors/customErrors.js";
import chargingStationRepo from "../../repos/chargingStation.repo.js";

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
}

export default new ChargingStationTypeValidation();