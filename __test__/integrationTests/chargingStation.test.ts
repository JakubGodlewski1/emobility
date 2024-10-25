import {afterEach, beforeAll, describe, expect} from "vitest";
import {CreateChargingStation, CreateChargingStationType, CreateConnector} from "../../types.js";
import Test from "./Test.js";
import chargingStationRepo from "../../src/repos/chargingStation.repo.js";
import connectorRepo from "../../src/repos/connector.repo.js";
import chargingStationTypeRepo from "../../src/repos/chargingStationType.repo.js";

const chargingStationType:CreateChargingStationType=  {
    name: 'Standard AC Charger',
    plugCount: 2,
    efficiency: 2.2,
    currentType: 'AC',
}

const connector:CreateConnector = {
    name: "connector1",
    priority: false
}

afterEach(async () => {
    await connectorRepo.deleteAll()
    await chargingStationRepo.deleteAll()
    await chargingStationTypeRepo.deleteAll()
})

beforeAll(async ()=>{
    await connectorRepo.deleteAll()
    await chargingStationRepo.deleteAll()
    await chargingStationTypeRepo.deleteAll()
})

describe("chargingStation",async () => {
    const {request} = await Test.build("charging-stations")
    const {request:connectorRequest} = await Test.build("connectors")
    const {request:chargingStationTypeRequest} = await Test.build("charging-station-types")

    const chargingStation:CreateChargingStation = {
        name: "station1",
        deviceId: "1d5367cd-1240-486a-b2d0-6a5e946bf8bd",
        ipAddress: "203.0.113.1",
        firmwareVersion: "1.2.5"
    }

    const chargingStation2:CreateChargingStation = {
        name: "station2",
        deviceId: "1d5367cc-1240-486a-b2d0-6a5e946bf8bd",
        ipAddress: "202.0.113.1",
        firmwareVersion: "1.3.5"
    }

    it('should add charging station to db', async () => {
        const response = await request.post(chargingStation)
        expect(response.body.data).toMatchObject(chargingStation)
    });

    it('should not add charging station to db if any required element is missing', async () => {
        const response = await request.post({...chargingStation, name: undefined})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/name must be provided/i)
    });

    it('should not add charging station  to db if there is any additional key:value in the body', async () => {
        const response = await request.post({...chargingStation, additionalField:"extra"})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/does not exist on/i)
    });

    it('Should update charging station type one field', async () => {
        const {body:{data}} = await request.post(chargingStation)
        const response = await request.put(data.id, {name: "updated name"})
        expect(response.body.data).toMatchObject({...data, name: "updated name"})
    });

    it('Should get all charging stations',async () => {
        await request.post(chargingStation)
        await request.post(chargingStation2)

        const response = await request.get()
        expect(response.body.data.length).toBe(2)

    });

    it('should get given charging station by filtering',async () => {
        await request.post(chargingStation)
        await request.post(chargingStation2)

        const response = await request.get("?name=station2")
        expect(response.body.data.length).toBe(1)
    });

    it('should delete charging station',async () => {
        await request.post(chargingStation)
        const {body:{data:{id}}} = await request.post(chargingStation2)

        const response1 = await request.get()
        expect(response1.body.data.length).toBe(2)

        await request.delete(id)

        const response2 = await request.get()
        expect(response2.body.data.length).toBe(1)
    });

    it('should throw error during get, update, delete if id of an element is not correct uuid', async () => {
        const {body:{error:error1}} = await request.getById("123412341231")
        const {body:{error:error2}} = await request.put("123123212131",chargingStation2)
        const {body:{error: error3}} = await request.delete("123412341231")

        expect(error1).toMatch(/ is not a valid uuid/i)
        expect(error2).toMatch(/ is not a valid uuid/i)
        expect(error3).toMatch(/ is not a valid uuid/i)
    });

    it('should not be able to add charging station type id with wrong amount of plug_counts', async () => {
        //create charging station
        const {body:{data:{id:chargingStationId}}} = await request.post(chargingStation as CreateChargingStation)

        //create 1 connector and add it to charging station
        await connectorRequest.post({...connector, chargingStationId} as CreateConnector)

        //create type with 2 plug_counts
        const {body:{data:{id:chargingStationTypeId}}} = await chargingStationTypeRequest.post(chargingStationType)

        //try to update charging station type id in charging station
        const {body} = await request.put(chargingStationId, {chargingStationTypeId} as Partial<CreateChargingStation>)

        //expect error
        expect(body.success).toBe(false)
        expect(body.error).not.toBe(undefined)
        expect(body.error).toMatch(/does not equal to plug count /i)
    });

      it('should  be able to add charging station type id with correct amount of plug_counts', async () => {
          //create charging station
          const {body:{data:{id:chargingStationId}}} = await request.post(chargingStation as CreateChargingStation)

          //create 2 connectors and add them to charging station
          await connectorRequest.post({...connector, chargingStationId} as CreateConnector)
          await connectorRequest.post({...connector, chargingStationId} as CreateConnector)

          //create type with 2 plug_counts
          const {body:{data:{id:chargingStationTypeId}}} = await chargingStationTypeRequest.post(chargingStationType)

          //update charging station type id in charging station
          const {body} = await request.put(chargingStationId, {chargingStationTypeId} as Partial<CreateChargingStation>)

          //expect proper update and success = true
          expect(body.success).toBe(true)
          expect(body.error).toBe(undefined)
          expect(body.data).toMatchObject({...chargingStation, chargingStationTypeId})
    });
})