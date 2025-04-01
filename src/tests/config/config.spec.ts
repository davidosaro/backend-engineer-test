/* eslint-disable @typescript-eslint/no-require-imports */

describe("Environment Variables", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should load default values when environment variables are not set", () => {
    process.env.MONGODB_URI = "";
    process.env.PORT = "";
    process.env.API_URL = "";
    process.env.ACCESS_TOKEN = "";
    process.env.REFRESH_TOKEN = "";

    const { databaseConnectionString, port, apiUrl, accessKey, refreshKey } = require("../../config");

    expect(databaseConnectionString).toBe("");
    expect(port).toBe(3000);
    expect(apiUrl).toBe("api/v1");
    expect(accessKey).toBe("");
    expect(refreshKey).toBe("");
  });

  it("should correctly load values from environment variables", () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";
    process.env.PORT = "5000";
    process.env.API_URL = "api/v2";
    process.env.ACCESS_TOKEN = "mockAccessToken";
    process.env.REFRESH_TOKEN = "mockRefreshToken";

    const { databaseConnectionString, port, apiUrl, accessKey, refreshKey } = require("../../config");

    expect(databaseConnectionString).toBe("mongodb://localhost:27017/testdb");
    expect(port).toBe(5000);
    expect(apiUrl).toBe("api/v2");
    expect(accessKey).toBe("mockAccessToken");
    expect(refreshKey).toBe("mockRefreshToken");
  });

  it("should use default values when specific environment variables are not set", () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";
    process.env.PORT = "6000";
    process.env.API_URL = "api/v2";
    process.env.ACCESS_TOKEN = "mockAccessToken";
    process.env.REFRESH_TOKEN = "";

    const { databaseConnectionString, port, apiUrl, accessKey, refreshKey } = require("../../config");

    expect(databaseConnectionString).toBe("mongodb://localhost:27017/testdb");
    expect(port).toBe(6000);
    expect(apiUrl).toBe("api/v2");
    expect(accessKey).toBe("mockAccessToken");
    expect(refreshKey).toBe("");
  });
});
