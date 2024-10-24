import Controller from "./base.controller.js";
import {ChargingStation, TableName} from "../../types.js";

class StationController extends Controller<ChargingStation> {
    constructor() {
        const tableName: TableName = 'charging_station';
        super(tableName);
    }
}

export default new StationController()