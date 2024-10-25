import {z} from "zod";
import ConnectorValidator from "./src/validators/connector.validator.js";
import ChargingStationValidator from "./src/validators/chargingStation.validator.js";
import ChargingStationTypeValidator from "./src/validators/chargingStationType.validator.js";


//connector
type CreateConnector = z.infer<typeof ConnectorValidator.create>
type Connector = {
    id: string
} & CreateConnector

//charging station
type CreateChargingStation = z.infer<typeof ChargingStationValidator.create>
type ChargingStation = {
    id: string
} & CreateChargingStation


//charging station type
type CreateChargingStationType = z.infer<typeof ChargingStationTypeValidator.create>
type ChargingStationType = {
    id: string
} & CreateChargingStationType

//structure of a response that is sent to the client
type Reply = {
    success: true,
    data: ChargingStation | ChargingStation[] | Connector | Connector[] | ChargingStationType | ChargingStationType[] | {
        accessToken: string
    } | undefined
} | {
    success: false,
    error: string
}

//table name
type TableName = "charging_station_type" | "charging_station" | "connector"

type Summary = {
    connectors?: number,
    connectorsWithPriority?: number,
    plugCount?: number
}