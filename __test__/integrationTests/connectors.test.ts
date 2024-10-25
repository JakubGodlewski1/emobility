import {afterEach, beforeAll, describe, expect} from "vitest";
import {CreateChargingStation, CreateChargingStationType, CreateConnector} from "../../types.js";
import Test from "./Test.js";
import connectorRepo from "../../src/repos/connector.repo.js";
import chargingStationRepo from "../../src/repos/chargingStation.repo.js";
import chargingStationTypeRepo from "../../src/repos/chargingStationType.repo.js";

const chargingStationType:CreateChargingStationType=  {
    name: 'Standard AC Charger',
    plugCount: 1,
    efficiency: 2.2,
    currentType: 'AC',
}

const chargingStation:CreateChargingStation = {
    name: "SuperCharge Station",
    deviceId: "3fa25f22-5717-4562-b3fc-2c963f66afa6",
    ipAddress: "123.168.1.200",
    firmwareVersion: "v1.0.5",
}

describe("connectors",async () => {
    const {request} = await Test.build("connectors")
    const {request:chargingStationRequest} = await Test.build("charging-stations")
    const {request:chargingStationTypeRequest} = await Test.build("charging-station-types")

    beforeAll(async ()=>{
        await connectorRepo.deleteAll()
        await chargingStationRepo.deleteAll()
        await chargingStationTypeRepo.deleteAll()
    })

    afterEach(async () => {
        await connectorRepo.deleteAll()
        await chargingStationRepo.deleteAll()
        await chargingStationTypeRepo.deleteAll()
    })

    const connector:CreateConnector = {
        name: "connector1",
        priority: false
    }

    const connector2:CreateConnector = {
        name: "connector2",
        priority: true
    }

    it('should add connector to db', async () => {
        const response = await request.post(connector)
        expect(response.body.data).toMatchObject(connector)
    });

    it('should not add connector to db if any required element is missing', async () => {
        const response = await request.post({...connector, name: undefined})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/name must be provided/i)
    });

    it('should not add connector to db if there is any additional key:value in the body', async () => {
        const response = await request.post({...connector, additionalField:"extra"})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/does not exist on/i)
    });

    it('Should update connector one field', async () => {
        const {body:{data}} = await request.post(connector)
        const response = await request.put(data.id, {name: "updated name"})
        expect(response.body.data).toMatchObject({...data, name: "updated name"})
    });


    it('Should get all connectors',async () => {
        await request.post(connector)
        await request.post(connector2)

        const response = await request.get()
        expect(response.body.data.length).toBe(2)

    });

    it('should get given connector by filtering',async () => {
        await request.post(connector)
        await request.post(connector2)

        const response = await request.get("?name=connector1")
        expect(response.body.data.length).toBe(1)
    });

    it('should delete connector if the charging station id is not specified',async () => {
        await request.post(connector)
        const {body:{data:{id}}} = await request.post(connector2)

        const response1 = await request.get()
        expect(response1.body.data.length).toBe(2)

        await request.delete(id)

        const response2 = await request.get()
        expect(response2.body.data.length).toBe(1)
    });

    it('should throw error during get, update, delete if id of an element is not correct uuid', async () => {
        const {body:{error:error1}} = await request.getById("123412341231")
        const {body:{error:error2}} = await request.put("123123212131",connector)
        const {body:{error: error3}} = await request.delete("123412341231")

        expect(error1).toMatch(/ is not a valid uuid/i)
        expect(error2).toMatch(/ is not a valid uuid/i)
        expect(error3).toMatch(/ is not a valid uuid/i)
    });

    it('should not be able to add connector to charging station with specified type', async () => {

        //create a charging station type with 1 plug_count
        const {body:{data:{id:chargingStationTypeId}}} = await chargingStationTypeRequest.post(chargingStationType)

        //create charging station without a type
        const {body:{data:{id:chargingStationId}}} = await chargingStationRequest.post(chargingStation as CreateChargingStation)

        //create connector with charging station id
        const {body:{data:{id:connectorId}}} = await request.post({...connector, chargingStationId} as CreateConnector)

        //update charging station - add a type to it
        await chargingStationRequest.put(chargingStationId, {chargingStationTypeId} as Partial<CreateChargingStation>)

        // //try to create a new connector with the charging station id
       const {body} = await request.post({...connector, chargingStationId } as CreateConnector)

        //expect error
        expect(body.success).toBe(false)
        expect(body.error).not.toBe(undefined)
        expect(body.error).toMatch(/can't add the connector to charging station with specified type/i)

        //try to update the first connector by adding a new charging station id
         const response =await request.put(connectorId, {chargingStationId} as Partial<CreateConnector>)

        //expect error
        expect(response.body.success).toBe(false)
        expect(body.error).not.toBe(undefined)
        expect(body.error).toMatch(/can't add the connector to charging station with specified type/i)
    });

    it('should not be able to set priority to true in a charging station if another connector connected to the station has already set priority to true', async () => {
        //create charging station
        const {body:{data:{id:chargingStationId}}} = await chargingStationRequest.post(chargingStation as CreateChargingStation)

        //create connector and add it to charging station. set priority to true
        await request.post({...connector2, chargingStationId} as CreateConnector)

        //create a new connector with priority set to true and try to point to the same station
        const {body} = await request.post({...connector2, chargingStationId} as CreateConnector)

        //expect error
        expect(body.success).toBe(false)
        expect(body.error).not.toBe(undefined)
        expect(body.error).toMatch(/only one connector with priority/i)

        //try to create a new connector with priority true, dont point to any charging station
        const {body:{data:{id:connectorId}}} = await request.post(connector2 as CreateConnector)

        //try to update the connector so it points to the charging station
        await request.put(connectorId, {chargingStationId} as Partial<CreateConnector>)

        //expect error
        expect(body.success).toBe(false)
        expect(body.error).not.toBe(undefined)
        expect(body.error).toMatch(/only one connector with priority/i)
    });
})