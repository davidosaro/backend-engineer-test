import winston from "winston";
import chalk from "chalk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((msg) => `${chalk.magenta(msg.timestamp)} [${msg.level}] ${msg.message}`)
  ),
  transports: [new winston.transports.Console({ level: "http" })],
});

export default logger;
