import {afterEach, describe} from "vitest";
import {CreateChargingStation} from "../../types.js";
import Test from "../helpers.js";
import chargingStationRepo from "../../src/repos/chargingStation.repo.js";

describe("chargingStation",async () => {
    const {request} = await Test.build("charging-stations")

    afterEach(async () => {
        await chargingStationRepo.deleteAll()
    })

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
})