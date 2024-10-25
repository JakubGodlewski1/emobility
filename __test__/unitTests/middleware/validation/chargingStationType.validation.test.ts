import {describe, expect, it, vi} from 'vitest';
import {NextFunction, Response} from 'express';
import chargingStationRepo from "../../../../src/repos/chargingStation.repo.js";
import ChargingStationRepo from "../../../../src/repos/chargingStation.repo.js";
import ChargingStationTypeValidation from "../../../../src/middleware/validation/chargingStationType.validation.js";
import {BadRequestError} from "../../../../src/errors/customErrors.js";
import ChargingStationTypeRepo from "../../../../src/repos/chargingStationType.repo.js";
import {ChargingStation, ChargingStationType} from "../../../../types.js";


const chargingStationType:ChargingStationType=  {
    name: 'Standard AC Charger',
    plugCount: 4,
    efficiency: 2.2,
    currentType: 'AC',
    id:"1"
}

const chargingStation:ChargingStation = {
    name: "SuperCharge Station",
    deviceId: "3fa25f22-5717-4562-b3fc-2c963f66afa6",
    ipAddress: "123.168.1.200",
    firmwareVersion: "v1.0.5",
    id:"1"
}

describe('ChargingStationTypeValidation', () => {
    describe('deleteAction', () => {
        it("should throw a BadRequestError if charging stations use the type", async () => {
            const req = {
                params: { id: '1' },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return charging stations using the type
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValue([chargingStation]);

            await expect(ChargingStationTypeValidation.deleteAction(req, res, next)).rejects.toThrow(BadRequestError);
            await expect(ChargingStationTypeValidation.deleteAction(req, res, next)).rejects.toThrow("You cant delete the type because the type is being used by 1 charging stations");
        });

        it("should call next() if no charging stations are using the type", async () => {
            const req = {
                params: { id: '1' },
            }  as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repository method to return no charging stations
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValue([]);

            await ChargingStationTypeValidation.deleteAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('updateAction', () => {
        it("should throw a BadRequestError if charging stations are using the type and plugCount is updated", async () => {
            const req = {
                params: { id: '1' },
                body: { plugCount: 5 },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repository methods
            vi.spyOn(ChargingStationTypeRepo, 'getById').mockResolvedValue(chargingStationType);

            // Simulate charging station using the type
            vi.spyOn(ChargingStationRepo, 'get').mockResolvedValue([chargingStation]);

            await expect(ChargingStationTypeValidation.updateAction(req, res, next)).rejects.toThrow(BadRequestError);
            await expect(ChargingStationTypeValidation.updateAction(req, res, next)).rejects.toThrow("You can't update plug_count if any charging station is using this type");
        });

        it("should call next() if plugCount is not updated", async () => {
            const req = {
                params: { id: '1' },
                body: { plugCount: null },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            await ChargingStationTypeValidation.updateAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("should call next() if plugCount is the same", async () => {
            const req = {
                params: { id: '1' },
                body: { plugCount: 4 },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repository method
            vi.spyOn(ChargingStationTypeRepo, 'getById').mockResolvedValue(chargingStationType); // Same plugCount

            await ChargingStationTypeValidation.updateAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("should call next() if no charging stations are using the type", async () => {
            const req = {
                params: { id: '1' },
                body: { plugCount: 5 },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repository methods
            vi.spyOn(ChargingStationTypeRepo, 'getById').mockResolvedValue(chargingStationType); // Previous plugCount
            vi.spyOn(ChargingStationRepo, 'get').mockResolvedValue([]); // No charging stations using the type

            await ChargingStationTypeValidation.updateAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});