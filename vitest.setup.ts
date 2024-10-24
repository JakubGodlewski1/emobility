import {afterAll, beforeAll} from "vitest";
import pool from "./src/lib/orm/db.js";

beforeAll(async () => {
   await pool.connect()
})

afterAll(async () => {
    await pool.end()
})