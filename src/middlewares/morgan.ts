import morgan from "morgan";
import logger from "../logger";

const morganMiddleware = morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
