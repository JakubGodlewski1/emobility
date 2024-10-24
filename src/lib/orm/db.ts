import pg from "pg";
import {poolConfig} from "../../config/db.config.js";

const pool = new pg.Pool(poolConfig)
export default pool