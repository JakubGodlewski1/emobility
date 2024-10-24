import {TableName} from "../../types.js";
import {TABLE_NAMES} from "../config/constants.js";

export const validateTableNames = (tableName: TableName) => {
    if (!TABLE_NAMES.includes(tableName)) {
        throw new Error("The provided table name does not exist")
    }
}