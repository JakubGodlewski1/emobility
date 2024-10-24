import {z} from "zod";
import {uuidRegex} from "../utils/uuidRegex.js";

export default class StationValidator {
    static create = z.object({
        name:
            z.string({message: "Name must be provided"})
                .min(2, "Name must be at least 2 characters long")
                .max(40, {message: "Name must be at most 40 characters long"}),
        deviceId:
            z.string({message: "Device id must be provided"})
                .regex(uuidRegex, {message: "Invalid device id"}),
        ipAddress:
            z.string({message: "Ip address must be provided"})
                .ip({message: "Invalid IP address format"}),
        firmwareVersion:
            z.string({message: "Firmware must be provided"})
                .min(5, "Firmware must be at least 5 characters long")
                .max(40, {message: "Firmware version must be at most 40 characters long"}),
        chargingStationTypeId:
            z.string({message: "Charging station type id must be provided"})
                .regex(uuidRegex, {message: "Invalid charging station type"})
                .nullable()
                .optional(),
    }).strict("You passed a key that does not exist on charging station object");

    static update = z.object({
        name:
            z.string({message: "Name must be provided"})
                .min(2, "Name must be at least 2 characters long")
                .max(40, {message: "Name must be at most 40 characters long"})
                .optional(),
        deviceId:
            z.string({message: "Device id must be provided"})
                .regex(uuidRegex, {message: "Invalid device id"})
                .optional(),
        ipAddress:
            z.string({message: "Ip address must be provided"})
                .ip({message: "Invalid IP address format"})
                .optional(),
        firmwareVersion:
            z.string({message: "Firmware must be provided"})
                .min(5, "Firmware must be at least 5 characters long")
                .max(40, {message: "Firmware version must be at most 40 characters long"})
                .optional(),
        chargingStationTypeId:
            z.string({message: "Charging station type id must be provided"})
                .regex(uuidRegex, {message: "Invalid charging station type"})
                .optional(),
    })
        .strict("You passed a key that does not exist on charging station object")

    static get = this.update && z.object({
        id:
            z.string()
                .regex(uuidRegex, {message: "Invalid charging station type id"})
                .optional()
    })
}