import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI: databaseConnectionString = "", PORT: port = 3000, API_URL: apiUrl = "api/v1" } = process.env;

export { databaseConnectionString, port, apiUrl };
