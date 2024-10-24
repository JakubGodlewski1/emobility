//start server
import pool from "./orm/db.js";
import {Express} from "express";
import {loadDotEnv} from "../utils/loadDotEnv.js";

loadDotEnv()

const PORT = process.env.PORT || 3000;

export const startServer = async (app: Express) => {
    try {
        //connect to db
        await pool.connect()
        //start the server
        return app.listen(PORT, async () => console.log("Server running on port: " + PORT))
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}