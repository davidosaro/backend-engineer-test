import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { databaseConnectionString } from "./index";
import logger from "../logger";

export const connectDatabase = async () => {
  try {
    if (!databaseConnectionString) throw new Error("Database connection string not provided");
    await mongoose.connect(databaseConnectionString);
    logger.info("Database Connected successfully ✅");
  } catch (error) {
    logger.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
