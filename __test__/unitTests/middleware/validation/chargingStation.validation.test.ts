import { describe, it, expect, vi } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import chargingStationValidation from "../../../../src/middleware/validation/chargingStation.validation.js";
import chargingStationRepo from "../../../../src/repos/chargingStation.repo.js";
import {CreateChargingStation, CreateChargingStationType} from "../../../../types.js";
import ChargingStationRepo from "../../../../src/repos/chargingStation.repo.js";

const chargingStation:CreateChargingStation = {
    name: "SuperCharge Station",
    deviceId: "3fa25f22-5717-4562-b3fc-2c963f66afa6",
    ipAddress: "123.168.1.200",
    firmwareVersion: "v1.0.5"
}

const uuid = "123e4567-e89b-12d3-a456-426614174000"

describe('chargingStationValidation', () => {
    describe('createAction', () => {
        it("should throw an error if chargingStationTypeId is present", async () => {
            const req = {
                body: {...chargingStation, chargingStationTypeId: uuid} as CreateChargingStation,
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            await expect(chargingStationValidation.createAction(req, res, next)).rejects.toThrow("You can't add charging station type before adding proper amount of connectors");
        });

        it("should throw an error if a station with the same IP already exists", async () => {
            const req = {
                body: chargingStation,
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return a station with the same IP
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValue([{...chargingStation, name:"test2", deviceId: "123", firmwareVersion:"1.2.3", id:uuid }]);

            await expect(chargingStationValidation.createAction(req, res, next)).rejects.toThrow("Station with provided ip already exists");
        });

        it("should throw an error if a station with the same device ID already exists", async () => {
            const req = {
                body: chargingStation,
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return a station with the same device ID
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValueOnce([{...chargingStation, id: "123"}]); // Existing station for device ID
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValueOnce([]); // Existing station for device ID

            await expect(chargingStationValidation.createAction(req, res, next)).rejects.toThrow("Station with provided device id already exists");
        });

        it("should call next() if all validations pass", async () => {
            const req = {
                body: chargingStation,
            } as Request;

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return no existing stations
            vi.spyOn(chargingStationRepo, 'get').mockResolvedValue([]);

            await chargingStationValidation.createAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('updateAction', () => {
        it("should throw an error if chargingStationTypeId is present and previous type is not null", async () => {
            const req = {
                params: { id: '1' },
                body: { chargingStationTypeId: "234" },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return a station with a type
            vi.spyOn(ChargingStationRepo, 'getById').mockResolvedValue({...chargingStation, id: "12", chargingStationTypeId: "123"});

            await expect(chargingStationValidation.updateAction(req, res, next)).rejects.toThrow("You cant update charging station type. You have to delete it first, update the amount of connectors and add new charging station type");
        });

        it("should call next() if chargingStationTypeId is not present", async () => {
            const req = {
                params: { id: '1' },
                body: { chargingStationTypeId: null },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            await chargingStationValidation.updateAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("should call next() if the previous type is null", async () => {
            const req = {
                params: { id: '1' },
                body: { chargingStationTypeId: 1 },
            } as any

            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            // Mocking the repo method to return a station with no type
            vi.spyOn(ChargingStationRepo, 'getById').mockResolvedValue({...chargingStation, chargingStationTypeId: undefined, id:"12"});

            await chargingStationValidation.updateAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});