import {z} from "zod";
import {uuidRegex} from "../utils/uuidRegex.js";

export default class ConnectorValidator {
    static create = z.object({
        name:
            z.string({message: "Connector name is not provided"}),
        priority:
            z.boolean({invalid_type_error: "Priority has to be of type boolean"})
                .default(false),
        chargingStationId:
            z.string()
                .regex(uuidRegex, {message: "Invalid charging station id"})
                .optional(),
    }).strict("You passed a key that does not exist on connector object");

    static update = z.object({
        name:
            z.string({message: "Connector name is not provided"})
                .optional(),
        priority:
            z.boolean({invalid_type_error: "Priority has to be of type boolean"})
                .optional(),
        chargingStationId:
            z.string()
                .regex(uuidRegex, {message: "Invalid charging station id"})
                .nullable()
                .optional()
    })
        .strict("You passed a key that does not exist on connector object")

    static get = this.update && z.object({
        id:
            z.string()
                .regex(uuidRegex, {message: "Invalid charging station type id"})
                .optional()
    })
}