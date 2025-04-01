import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI, PORT, API_URL, ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

export const { databaseConnectionString, port, apiUrl, accessKey, refreshKey } = {
  databaseConnectionString: MONGODB_URI || "",
  port: Number(PORT) || 3000,
  apiUrl: API_URL || "api/v1",
  accessKey: ACCESS_TOKEN || "",
  refreshKey: REFRESH_TOKEN || "",
};
