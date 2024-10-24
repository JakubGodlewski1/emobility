import {getQueryClient} from "../lib/orm/getQueryClient.js";
import {toCamelCase} from "../lib/orm/ToCamelCase.js";
import {toSnakeCase} from "../lib/orm/toSnakeCase.js";
import pool from "../lib/orm/db.js";
import {PoolClient} from "pg";
import {validateTableNames} from "../utils/ValidateTableNames.js";
import {TableName} from "../../types.js";

export default class Repo<T extends Record<string, any>> {
    tableName: TableName;

    constructor(tableName: TableName) {
        validateTableNames(tableName)
        this.tableName = tableName;
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

    deleteAll = async ({client: transactionClient}: { client?: PoolClient } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient)

        const {rows} = await client.query(`
            DELETE FROM ${this.tableName}
            RETURNING *;
        `,)

        return toCamelCase(rows)[0] as T
    }


    update = async (id: string, update: Partial<T>, {client: transactionClient}: {
        client?: PoolClient
    } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient)

        // Convert update fields to snake case
        const snakeCasedObj = toSnakeCase(update);

        // Get the keys of the fields to update
        const keys = Object.keys(snakeCasedObj);

        // If there are no fields to update, throw an error
        if (keys.length === 0) {
            throw new Error("No fields provided to update");
        }

        // create the SET clause
        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = keys.map(key => snakeCasedObj[key]);

        // First value is the id, followed by the update field values
        const {rows} = await client.query(
            `
        UPDATE ${this.tableName}
        SET ${setClause}
        WHERE id = $1
        RETURNING *;
        `,
            [id, ...values]
        );

        // Return the updated element
        return toCamelCase(rows)[0] as T;
    }

    insert = async <D extends Record<string, any>>(element: D, {client: transactionClient}: {
        client?: PoolClient
    } = {}): Promise<T> => {
        const client = getQueryClient(transactionClient);

        // Validate the element is provided
        if (!element || Object.keys(element).length === 0) {
            throw new Error("No element provided for insertion");
        }

        // Get the column names from the keys of the element
        const columns = Object.keys(toSnakeCase(element));

        // Create a string of placeholders ($1, $2, etc.)
        const valuesPlaceholders = `(${columns.map((_, i) => `$${i + 1}`).join(', ')})`;

        // Get the values from the element
        const values = Object.values(toSnakeCase(element));

        const query = `
        INSERT INTO ${this.tableName} (${columns.join(', ')})
        VALUES ${valuesPlaceholders}
        RETURNING *;
    `;

        const {rows} = await client.query(query, values);

        return toCamelCase(rows)[0] as T;  // Return a single inserted row as the result
    };
}