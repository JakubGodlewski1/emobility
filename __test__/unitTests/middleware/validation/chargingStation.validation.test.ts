import {describe, expect, it, vi} from 'vitest';
import {NextFunction, Request, Response} from 'express';
import chargingStationValidation from "../../../../src/middleware/validation/chargingStation.validation.js";
import chargingStationRepo from "../../../../src/repos/chargingStation.repo.js";
import ChargingStationRepo from "../../../../src/repos/chargingStation.repo.js";
import {ChargingStation, ChargingStationType, CreateChargingStation} from "../../../../types.js";
import ChargingStationTypeRepo from "../../../../src/repos/chargingStationType.repo.js";
import ConnectorRepo from "../../../../src/repos/connector.repo.js";
import {BadRequestError} from "../../../../src/errors/customErrors.js";

const chargingStation:ChargingStation = {
    name: "SuperCharge Station",
    deviceId: "3fa25f22-5717-4562-b3fc-2c963f66afa6",
    ipAddress: "123.168.1.200",
    firmwareVersion: "v1.0.5",
    id:"234"
}

const chargingStationType:ChargingStationType=  {
    name: 'Standard AC Charger',
    plugCount: 2,
    efficiency: 2.2,
    currentType: 'AC',
    id:"123"
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
        const mockReq = {
            params: { id: "123" },
            body: {},
        } as any

        const mockRes = {} as Partial<Response> as Response;
        const next = vi.fn();

        it("calls next if no chargingStationTypeId in update or existing charging station", async () => {
            mockReq.body = {};
            vi.spyOn(ChargingStationRepo, "getById").mockResolvedValue({...chargingStation, id: "321"});

            await chargingStationValidation.updateAction(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });


        it("calls next if chargingStationTypeId in update is null", async () => {
            mockReq.body = { chargingStationTypeId: null };
            vi.spyOn(ChargingStationRepo, "getById").mockResolvedValue({...chargingStation, id: "321", chargingStationTypeId: null});

            await chargingStationValidation.updateAction(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it("throws BadRequestError if connectors count differs from charging station type plug count", async () => {
            mockReq.body = { chargingStationTypeId: "type-id" };
            vi.spyOn(ChargingStationRepo, "getById").mockResolvedValue(chargingStation);
            vi.spyOn(ChargingStationTypeRepo, "getById").mockResolvedValue(chargingStationType);
            vi.spyOn(ConnectorRepo, "get").mockResolvedValue([{name: "connector1", priority: false, id:"123"}]);

            await expect(chargingStationValidation.updateAction(mockReq, mockRes, next)).rejects.toThrow(BadRequestError);
        });

        it("calls next if connectors count matches charging station type plug count", async () => {
            mockReq.body = { chargingStationTypeId: "type-id" };
            vi.spyOn(ChargingStationRepo, "getById").mockResolvedValue(chargingStation);

            vi.spyOn(ChargingStationTypeRepo, "getById").mockResolvedValue(chargingStationType);
            vi.spyOn(ConnectorRepo, "get").mockResolvedValue([
                {name: "connector1", priority: false, id:"123"}, {name: "connector2", priority: true, id:"312"}
            ]);

            await chargingStationValidation.updateAction(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });
    });
});