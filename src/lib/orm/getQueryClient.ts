import {PoolClient} from "pg";
import pool from "./db.js";

export const getQueryClient = (transactionClient: undefined | PoolClient) => transactionClient || pool
