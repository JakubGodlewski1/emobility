import Repo from "./base.repo.js";
import {ChargingStation, TableName} from "../../types.js";

class ChargingStationRepo extends Repo<ChargingStation> {
    constructor() {
        const tableName: TableName = "charging_station"
        super(tableName);
    }
}

export default new ChargingStationRepo();