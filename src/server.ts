import app from "./app.js";
import {loadDotEnv} from "./utils/loadDotEnv.js";
import {startServer} from "./lib/startServer.js";

loadDotEnv()
const PORT = process.env.PORT || 3000;

await startServer(app)