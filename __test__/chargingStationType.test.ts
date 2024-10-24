import {afterEach, describe} from "vitest";
import {CreateChargingStationType} from "../types.js";
import Test from "./helpers.js";
import chargingStationTypeRepo from "../src/repos/chargingStationType.repo.js";

describe("chargingStationType",async () => {
    const {request} = await Test.build("charging-station-types")

    afterEach(async () => {
        await chargingStationTypeRepo.deleteAll()
    })

    it('should add charging station type to db', async () => {
            const chargingStationType:CreateChargingStationType = {
                name: "charging station 1",
                currentType: "AC",
                efficiency: 3.0,
                plugCount: 2
            }

          const response = await request.post(chargingStationType)
            expect(response.body.data).toMatchObject(chargingStationType)
    });

    it('should not add charging station type to db if any required element is missing', () => {

    });

    it('should not add charging station type to db if there is any additional key:value in the body', () => {

    });

    it('Should update charging station type one field', () => {

    });

    it('Should update charging station type all fields', () => {

    });

    it('Should get all charging station types', () => {

    });

    it('should get given charging station types by filtering', () => {

    });

    it('should get charging station types with limits (e.g. up to 2 elements)', () => {

    });

    it('should delete charging station types if no charging station has its type', () => {

    });

     it('should not delete charging station type if any charging station has its type', () => {

    });
})