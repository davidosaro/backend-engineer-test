import express from "express";
import { connectDatabase } from "./config/db";
import { port } from "./config";
import logger from "./logger";
import chalk from "chalk";
import cors from "cors";
import { successResponse } from "./helpers/response";

const app = express();

// DATABASE CONNECTIONS --------------------------------
connectDatabase();

app.use(cors());

// MIDDLEWARES --------------------------------
app.use(express.json());

// ROUTES --------------------------------
app.get("/", (req, res) => {
  successResponse(res, 200, {
    message: "Welcome to the David Osaro MainStack Backend Assessment",
  });
});

// INITIALIZE APP --------------------------------
app.listen(port, async () => {
  logger.info(`🗣️ : Listening on port ${chalk.green(port)}`);
});
