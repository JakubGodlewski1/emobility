import {getQueryClient} from "../lib/orm/getQueryClient.js";
import {toCamelCase} from "../lib/orm/ToCamelCase.js";
import {toSnakeCase} from "../lib/orm/toSnakeCase.js";
import pool from "../lib/orm/db.js";
import {PoolClient} from "pg";
import {validateTableNames} from "../utils/ValidateTableNames.js";
import {Summary, TableName} from "../../types.js";

export default class Repo<T extends Record<string, any>> {
    tableName: TableName;

    constructor(tableName: TableName) {
        validateTableNames(tableName)
        this.tableName = tableName;
    }

    static getSummary = async (chargingStationId: string): Promise<Summary> => {
        //get amount of connectors connected to charging station, plug_count from charging station type and id of charging station

        const {rows} = await pool.query(`
        SELECT
         COUNT(connector.id) AS connectors,
        (SELECT COUNT(connector.id) FROM connector WHERE connector.priority = true) AS connectors_with_priority,
        charging_station_type.plug_count
        FROM charging_station
        JOIN connector ON connector.charging_station_id = charging_station.id
        JOIN charging_station_type ON charging_station_type.id = charging_station.charging_station_type_id
        WHERE charging_station.id = $1
        GROUP BY charging_station.id, charging_station_type.plug_count;
    `, [chargingStationId]);

        if (rows.length === 0)
            rows[0] = {
                connectors: 0,
                plugCount: undefined,
                connectorsWithPriority: 0
            } as Summary
        return toCamelCase(rows)[0] as Summary;
    }

    getById = async (id: string, {client: transactionClient}: { client?: PoolClient } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient)

        const {rows} = await client.query(`
            SELECT * FROM ${this.tableName}
            WHERE id = $1;
        `, [id])

        return toCamelCase(rows)[0] as T
    }

    get = async (filters?: Partial<Record<keyof T, string>>, {client: transactionClient}: {
        client?: PoolClient
    } = {}): Promise<T[]> => {
        const client = getQueryClient(transactionClient)

        //if no filters are provided, return all the objects
        if (!filters || Object.keys(filters).length === 0) {
            const {rows} = await client.query(`
            SELECT * FROM ${this.tableName}
    `);
            return toCamelCase(rows) as T[];
        }

        //prepare filters to inject into sql query
        const snakeCasedFilters = toSnakeCase(filters);
        const keys = Object.keys(snakeCasedFilters) as Array<keyof typeof snakeCasedFilters>;

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const values = keys.map(key => snakeCasedFilters[key]);

        //query
        const {rows} = await pool.query(`
        SELECT * FROM ${this.tableName}
        WHERE ${conditions};
    `, values);

        return toCamelCase(rows) as T[];
    }


    deleteById = async (id: string, {client: transactionClient}: { client?: PoolClient } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient)

        const {rows} = await client.query(`
            DELETE FROM ${this.tableName}
            WHERE id = $1
            RETURNING *;
        `, [id])

        return toCamelCase(rows)[0] as T
    }

    deleteAll = async ({client: transactionClient}: { client?: PoolClient } = {}): Promise<T[]> => {
        const client = getQueryClient(transactionClient)

        const {rows} = await client.query(`
            DELETE FROM ${this.tableName}
            RETURNING *;
        `,)

        return toCamelCase(rows) as T[]
    }


    update = async (id: string, update: Partial<T>, {client: transactionClient}: {
        client?: PoolClient
    } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient)

        if (!update || Object.keys(update).length === 0) {
            throw new Error("No fields provided to update");
        }

        const snakeCasedObj = toSnakeCase(update);

        const keys = Object.keys(snakeCasedObj);

        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = keys.map(key => snakeCasedObj[key]);

        const {rows} = await client.query(
            `
        UPDATE ${this.tableName}
        SET ${setClause}
        WHERE id = $1
        RETURNING *;
        `,
            [id, ...values]
        );

        return toCamelCase(rows)[0] as T;
    }

    insert = async <D extends Record<string, any>>(element: D, {client: transactionClient}: {
        client?: PoolClient
    } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient);

        if (!element || Object.keys(element).length === 0) {
            throw new Error("No element provided for insertion");
        }


        const columns = Object.keys(toSnakeCase(element));

        const valuesPlaceholders = `(${columns.map((_, i) => `$${i + 1}`).join(', ')})`;

        const values = Object.values(toSnakeCase(element));

        const query = `
        INSERT INTO ${this.tableName} (${columns.join(', ')})
        VALUES ${valuesPlaceholders}
        RETURNING *;
    `;

        const {rows} = await client.query(query, values);

        // Return a single inserted row as the result
        return toCamelCase(rows)[0] as T;
    };
}