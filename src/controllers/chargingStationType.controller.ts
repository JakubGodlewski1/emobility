import Controller from "./base.controller.js";
import {ChargingStationType, TableName} from "../../types.js";

class StationTypeController extends Controller<ChargingStationType> {
    constructor() {
        const tableName: TableName = 'charging_station_type';
        super(tableName);
    }
}

export default new StationTypeController();