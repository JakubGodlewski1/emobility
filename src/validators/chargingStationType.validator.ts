import {z} from "zod";
import {uuidRegex} from "../utils/uuidRegex.js";

export default class ChargingStationTypeValidator {
    static create = z.object({
        name:
            z.string({message: "Name must be provided"})
                .min(2, "Name must be at least 2 characters long")
                .max(40, {message: "Name must be at most 40 characters long"}),
        plugCount:
            z.number({invalid_type_error: "Plug Count must be a number.", required_error: "Please provide count count"})
                .min(1, "Charging station has to include at least one connector")
                .max(20, {message: "Charging station cannot include more than 20 connectors"})
                .int("The number you provided is not valid"),
        efficiency:
            z.number({invalid_type_error: "Efficiency be a number.", required_error: "Please provide efficiency"})
                .min(1, "Minimum value for efficiency is 1.0")
                .max(5, {message: "Maximum value for efficiency is 5.0"}),
        currentType:
            z.enum(["AC", "DC"], {
                invalid_type_error: "Current type value is incorrect",
                required_error: "Please provide current type"
            })
    }).strict("You passed a key that does not exist on charging station type object")

    static update = z.object({
        name:
            z.string()
                .min(2, "Name must be at least 2 characters long")
                .max(40, {message: "Name must be at most 40 characters long"})
                .optional()
        ,
        plugCount:
            z.number({invalid_type_error: "Plug Count must be a number"})
                .min(1, "Charging station has to include at least one connector")
                .max(20, {message: "Charging station cannot include more than 20 connectors"})
                .int("The number you provided is not valid")
                .optional(),
        efficiency:
            z.number({invalid_type_error: "Efficiency be a number."})
                .min(1, "Minimum value for efficiency is 1.0")
                .max(5, {message: "Maximum value for efficiency is 5.0"})
                .optional(),
        currentType:
            z.enum(["AC", "DC"], {invalid_type_error: "Current type value is incorrect"})
                .optional()
    })
        .strict("You passed a key that does not exist on charging station type object")


    static get = this.update && z.object({
        id:
            z.string()
                .regex(uuidRegex, {message: "Invalid charging station type id"})
                .optional()
    })
}