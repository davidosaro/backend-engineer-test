import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI: databaseConnectionString = "", PORT: port = 3000 } = process.env;

export { databaseConnectionString, port };
