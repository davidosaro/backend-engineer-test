import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { databaseConnectionString } from "./index";
import logger from "../logger";
import { RESPONSE_MESSAGES } from "../helpers/constants";

export const connectDatabase = async () => {
  try {
    if (!databaseConnectionString) throw new Error(RESPONSE_MESSAGES.DATABASE_CONNECTION_NOT_PROVIDED);
    await mongoose.connect(databaseConnectionString);
    logger.info("Database Connected successfully ✅");
  } catch (error) {
    logger.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
