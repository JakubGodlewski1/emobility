import dotenv from "dotenv";

export const loadDotEnv = ()=>{
    const env = process.env.NODE_ENV || "development";
    dotenv.config({path: `.env.${env}`})
}