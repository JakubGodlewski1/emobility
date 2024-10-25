import dotenv from "dotenv";

export const loadDotEnv = () => {
    // Always load the base .env file
    dotenv.config();

    // Load the environment-specific file (e.g., .env.dev or .env.test)
    const env = process.env.NODE_ENV || "dev";
    dotenv.config({ path: `.env.${env}` });
};