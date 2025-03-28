import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI: databaseConnectionString = "", PORT: port = 3000, API_URL: apiUrl = "api/v1", ACCESS_TOKEN: accessKey = "", REFRESH_TOKEN: refreshKey = "" } = process.env;

export { databaseConnectionString, port, apiUrl, accessKey, refreshKey };
