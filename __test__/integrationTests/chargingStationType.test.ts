import {afterEach, describe} from "vitest";
import {CreateChargingStationType} from "../../types.js";
import Test from "./Test.js";
import chargingStationTypeRepo from "../../src/repos/chargingStationType.repo.js";

describe("chargingStationType",async () => {
    const {request} = await Test.build("charging-station-types")

    afterEach(async () => {
        await chargingStationTypeRepo.deleteAll()
    })

    const chargingStationType:CreateChargingStationType = {
        name: "charging station type 1",
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

    it('should throw error during get, update, delete if id of an element is not correct uuid', async () => {
        const {body:{error:error1}} = await request.getById("123412341231")
        const {body:{error:error2}} = await request.put("123412341231", {name:"name"})
        const {body:{error: error3}} = await request.delete("123412341231")

        expect(error1).toMatch(/ is not a valid uuid/i)
        expect(error2).toMatch(/ is not a valid uuid/i)
        expect(error3).toMatch(/ is not a valid uuid/i)
    });
})