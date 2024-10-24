import {PoolConfig} from "pg"
import {loadDotEnv} from "../utils/loadDotEnv.js";
loadDotEnv()

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USER} = process.env
if (!DB_HOST || !DB_PORT || !DB_DATABASE || !DB_USER) {
    throw new Error("Missing an env variable necessary to connect to db");
}

export const poolConfig:PoolConfig = {
    host:DB_HOST,
    port: parseInt(DB_PORT),
    database:DB_DATABASE,
    user:DB_USER
}
