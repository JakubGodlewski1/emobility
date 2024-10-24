import {afterEach, describe} from "vitest";
import {CreateChargingStationType} from "../types.js";
import Test from "./helpers.js";
import chargingStationTypeRepo from "../src/repos/chargingStationType.repo.js";

describe("chargingStationType",async () => {
    const {request} = await Test.build("charging-station-types")

    afterEach(async () => {
        await chargingStationTypeRepo.deleteAll()
    })

    const chargingStationType:CreateChargingStationType = {
        name: "charging station 1",
        currentType: "AC",
        efficiency: 3.0,
        plugCount: 2
    }

    it('should add charging station type to db', async () => {
        const response = await request.post(chargingStationType)
        expect(response.body.data).toMatchObject(chargingStationType)
    });

    it('should not add charging station type to db if any required element is missing', async () => {
        const response = await request.post({...chargingStationType, name: undefined})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/name must be provided/i)
    });

    it('should not add charging station type to db if there is any additional key:value in the body', async () => {
        const response = await request.post({...chargingStationType, additionalField:"extra"})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/does not exist on/i)
    });

    it('Should update charging station type one field', async () => {
        const {body:{data}} = await request.post(chargingStationType)
        const response = await request.put(data.id, {name: "updated name"})
        console.log({updated: response.body})
        expect(response.body.data).toMatchObject({...data, name: "updated name"})
    });

    it('Should get all charging station types',async () => {
        await request.post(chargingStationType)
        await request.post({...chargingStationType, name: "nameNr2"})

        const response = await request.get()
        expect(response.body.data.length).toBe(2)

    });

    it('should get given charging station types by filtering',async () => {
        await request.post(chargingStationType)
        await request.post({...chargingStationType, name: "nameNr2"})

        const response = await request.get("?name=nameNr2")
        expect(response.body.data.length).toBe(1)
    });

    it('should delete charging station types if no charging station has its type',async () => {
        await request.post(chargingStationType)
        const {body:{data:{id}}} = await request.post({...chargingStationType, name: "nameNr2"})

        const response1 = await request.get()
        expect(response1.body.data.length).toBe(2)

        await request.delete(id)

        const response2 = await request.get()
        expect(response2.body.data.length).toBe(1)
    });

    it('should throw error during get, update, delete if id of an element is not correct uuid', async () => {
        const {body:{error:error1}} = await request.getById("123412341231")
        const {body:{error:error2}} = await request.put("123412341231", {name:"name"})
        const {body:{error: error3}} = await request.delete("123412341231")

        expect(error1).toMatch(/ is not a valid uuid/i)
        expect(error2).toMatch(/ is not a valid uuid/i)
        expect(error3).toMatch(/ is not a valid uuid/i)
    });

    it.todo('should not delete charging station type if any charging station has its type',async () => {
        //todo
    });

    it.todo('should not update plug_count if any charging station has its type',async () => {
        const {body:{data:newChargingStationType}} = await request.post(chargingStationType)
        //TODO - create charging station and connectors, add connectors to charging station, update charging station so it points to charging station type

        //todo- try to delete charging station type

    });

    it.todo('should get charging station types with limits (e.g. up to 2 elements)',async () => {
        //todo
    });

})