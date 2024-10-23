import "express-async-errors"
import express from "express";
import morgan from "morgan"
import dotenv from "dotenv";
import helmet from "helmet";

//app init
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//routers

//no found route

//error handlers


//start server
app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
})