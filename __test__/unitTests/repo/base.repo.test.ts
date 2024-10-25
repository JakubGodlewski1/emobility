import {describe, expect, it, vi} from 'vitest';
import Repo from "../../../src/repos/base.repo.js";
import pool from "../../../src/lib/orm/db.js";
import {toCamelCase} from "../../../src/lib/orm/ToCamelCase.js";
import {toSnakeCase} from "../../../src/lib/orm/toSnakeCase.js";

// Mock dependencies
vi.mock("../../../src/lib/orm/db.js");
vi.mock("../../../src/lib/orm/ToCamelCase.js");
vi.mock("../../../src/lib/orm/toSnakeCase.js");
vi.mock("../../../src/utils/ValidateTableNames.js");

describe('Repo', () => {
    const tableName = 'connector';
    const repo = new Repo(tableName);

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getSummary', () => {
        it('should return a summary of connectors', async () => {
            const mockSummary = { connectors: 1, plugCount: 2, connectorsWithPriority: 0 };
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockSummary] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([mockSummary]);

            const result = await Repo.getSummary('charging_station_id');
            expect(result).toEqual(mockSummary);
            expect(pool.query).toHaveBeenCalledTimes(1);
        });

        it('should return a default summary if no rows are returned', async () => {
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([{
                connectors: 0,
                plugCount: undefined,
                connectorsWithPriority: 0
            }]);

            const result = await Repo.getSummary('charging_station_id');
            expect(result).toEqual({
                connectors: 0,
                plugCount: undefined,
                connectorsWithPriority: 0
            });
        });
    });

    describe('getById', () => {
        it('should return the object by id', async () => {
            const mockData = { id: '1', name: 'test' };
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockData] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([mockData]);

            const result = await repo.getById('1');
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining(`WHERE id = $1`), ['1']);
        });
    });

    describe('get', () => {
        it('should return all records if no filters are provided', async () => {
            const mockData = [{ id: '1', name: 'test' }];
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockData } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce(mockData);

            const result = await repo.get();
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM'));
        });

        it('should apply filters and return records', async () => {
            const mockData = [{ id: '1', name: 'test' }];
            const filters = { name: 'test' };
            vi.mocked(toSnakeCase).mockReturnValueOnce(filters);
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockData} as any);
            vi.mocked(toCamelCase).mockReturnValueOnce(mockData);

            const result = await repo.get(filters);
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE name = $1'), ['test']);
        });
    });

    describe('deleteById', () => {
        it('should delete a record by id and return it', async () => {
            const mockData = { id: '1', name: 'test' };
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockData] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([mockData]);

            const result = await repo.deleteById('1');
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining(`DELETE FROM ${tableName}`), ['1']);
        });
    });

    describe('deleteAll', () => {
        it('should delete all records and return the result', async () => {
            const mockData = [{ id: '1', name: 'test' }];
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockData } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce(mockData);

            const result = await repo.deleteAll();
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining(`DELETE FROM ${tableName}`));
        });
    });

    describe('update', () => {
        it('should update a record and return it', async () => {
            const mockData = { id: '1', name: 'updated' };
            const update = { name: 'updated' };
            vi.mocked(toSnakeCase).mockReturnValueOnce({ name: 'updated' });
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockData] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([mockData]);

            const result = await repo.update('1', update);
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining(`UPDATE ${tableName}`), ['1', 'updated']);
        });

        it('should throw an error if no fields are provided to update', async () => {
            await expect(repo.update('1', {})).rejects.toThrow('No fields provided to update');
        });
    });

    describe('insert', () => {
        it('should insert a new record and return it', async () => {
            const mockData = { id: '1', name: 'new' };
            const newElement = { name: 'new' };
            vi.mocked(toSnakeCase).mockReturnValue(newElement);
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockData] } as any);
            vi.mocked(toCamelCase).mockReturnValueOnce([mockData]);

            const result = await repo.insert(newElement);
            expect(result).toEqual(mockData);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining(`INSERT INTO ${tableName}`), ['new']);
        });

        it('should throw an error if no element is provided for insertion', async () => {
            await expect(repo.insert({})).rejects.toThrow('No element provided for insertion');
        });
    });
});