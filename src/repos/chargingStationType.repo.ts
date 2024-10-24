import Repo from "./base.repo.js";
import {ChargingStationType, TableName} from "../../types.js";

class ChargingStationTypeRepo extends Repo<ChargingStationType> {
    constructor() {
        const tableName: TableName = "charging_station_type"
        super(tableName);
    }
}

export default new ChargingStationTypeRepo();

