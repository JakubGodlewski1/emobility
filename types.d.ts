import {z} from "zod";
import ConnectorValidator from "./src/validators/connector.validator.js";
import StationValidator from "./src/validators/station.validator.js";
import StationTypeValidator from "./src/validators/stationType.validator.js";


//connector
type CreateConnector = z.infer<typeof ConnectorValidator.create>
type Connector = {
    id: string
} & CreateConnector

//charging station
type CreateChargingStation = z.infer<typeof StationValidator.create>
type ChargingStation = {
    id: string
} & CreateChargingStation


//charging station type
type CreateChargingStationType = z.infer<typeof StationTypeValidator.create>
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