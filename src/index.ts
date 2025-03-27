import express from "express";
import { connectDatabase } from "./config/db";
import { port } from "./config";
import logger from "./logger";
import chalk from "chalk";
import cors from "cors";
import { successResponse, errorResponse } from "./helpers/response";
import { HttpStatus, RESPONSE_MESSAGES } from "./helpers/constants/index";
import errorHandler from "./middlewares/error-handler";
import { NotFoundError } from "./helpers/errors";

const app = express();

// DATABASE CONNECTIONS --------------------------------
connectDatabase();

// MIDDLEWARES --------------------------------
app.use(cors());
app.use(express.json());

// ROUTES --------------------------------
app.get("/", (req, res) => {
  successResponse(res, 200, {
    message: RESPONSE_MESSAGES.WELCOME,
  });
});

// HANDLE ERROR RESPONSE --------------------------------
app.use(errorHandler);

// UNKNOWN ROUTE ----------------------------------------------------------------
app.use((_, res, _next) => {
  const err = new NotFoundError(RESPONSE_MESSAGES.ENDPOINT_NOT_FOUND);
  errorResponse(res, err);
});

// INITIALIZE APP --------------------------------
app.listen(port, async () => {
  logger.info(`🗣️ : Listening on port ${chalk.green(port)}`);
});
