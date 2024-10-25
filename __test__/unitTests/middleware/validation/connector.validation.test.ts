import {describe, expect, it, vi} from 'vitest';
import {NextFunction, Request, Response} from 'express';
import ConnectorValidation from "../../../../src/middleware/validation/connector.validation.js";
import Repo from "../../../../src/repos/base.repo.js";
import {BadRequestError} from "../../../../src/errors/customErrors.js";
import ConnectorRepo from "../../../../src/repos/connector.repo.js";
import {Connector} from "../../../../types.js";

vi.mock("../../../../src/repos/connector.repo.js");
vi.mock("../../../../src/repos/connector.repo.js", () => {
    return {
        default: {
            getById: vi.fn()
        },
    };
});

const connector:Connector = {
    name: "connector",
    priority: true,
    id:"123"
}

describe('ConnectorValidation', () => {
    describe('createAction', () => {
        it('should call next if chargingStationId is not provided', async () => {
            const req = { body: {} } as Request;
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            await ConnectorValidation.createAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should throw BadRequestError if charging station has a specified type', async () => {
            const req = { body: { chargingStationId: '1' } } as Request;
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(Repo, "getSummary").mockResolvedValue({ plugCount: 1 });

            await expect(ConnectorValidation.createAction(req, res, next)).rejects.toThrow(BadRequestError);
        });

        it('should throw Error if there is already a connector with priority', async () => {
            const req = { body: {chargingStationId: "1", priority: true } } as Request;
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(Repo, "getSummary").mockResolvedValue({ plugCount: 0, connectorsWithPriority: 1 });

            await expect(ConnectorValidation.createAction(req, res, next)).rejects.toThrow('Charging station can handle only one connector with priority');
        });

        it('should call next if all validations pass', async () => {
            const req = { body: { chargingStationId: '1', priority: false } } as Request;
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(Repo, "getSummary").mockResolvedValue({ plugCount: 0, connectorsWithPriority: 0 });

            await ConnectorValidation.createAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('deleteAction', () => {
        it('should call next if connector is not connected to a charging station', async () => {
            const req = { params: { id: '1' } } as any
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.spyOn(ConnectorRepo, "getById").mockResolvedValue(connector);

            await ConnectorValidation.deleteAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should throw BadRequestError if charging station has a specified type', async () => {
            const req = { params: { id: '1' } } as any
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.mocked(ConnectorRepo.getById).mockResolvedValue({...connector, chargingStationId: "1"});
            vi.spyOn(Repo, "getSummary").mockResolvedValue({ plugCount: 1 });

            await expect(ConnectorValidation.deleteAction(req, res, next)).rejects.toThrow(BadRequestError);
        });

        it('should call next if all validations pass for deletion', async () => {
            const req = { params: { id: '1' } } as any
            const res = {} as Response;
            const next = vi.fn() as NextFunction;

            vi.mocked(ConnectorRepo.getById).mockResolvedValue({ ...connector, chargingStationId: '1' });
            vi.spyOn(Repo, "getSummary").mockResolvedValue({ plugCount: 0 });

            await ConnectorValidation.deleteAction(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});