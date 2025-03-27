import express from "express";
import { connectDatabase } from "./config/db";
import { port } from "./config";
import logger from "./logger";
import chalk from "chalk";
import cors from "cors";
import { successResponse, errorResponse } from "./helpers/response";
import { RESPONSE_MESSAGES } from "./helpers/constants/index";

const app = express();

// DATABASE CONNECTIONS --------------------------------
connectDatabase();

app.use(cors());

// MIDDLEWARES --------------------------------
app.use(express.json());

// ROUTES --------------------------------
app.get("/", (req, res) => {
  successResponse(res, 200, {
    message: RESPONSE_MESSAGES.WELCOME,
  });
});
// UNKNOWN ROUTE ----------------------------------------------------------------
app.use((_, res, next) => {
  errorResponse(res, 404, RESPONSE_MESSAGES.ENDPOINT_NOT_FOUND);
  // errorResMsg(res, HttpStatus.NOT_FOUND, ENDPOINT_NOT_FOUND);
});

// INITIALIZE APP --------------------------------
app.listen(port, async () => {
  logger.info(`🗣️ : Listening on port ${chalk.green(port)}`);
});
