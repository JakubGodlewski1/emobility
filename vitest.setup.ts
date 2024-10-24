import {afterAll, beforeAll} from "vitest";
import pool from "./src/lib/orm/db.js";
import {PoolClient} from "pg";

let client:PoolClient | undefined;

beforeAll(async () => {
   client = await pool.connect()

})

afterAll(async () => {
    if (client){
        client.release()
        await pool.end()
    }
})