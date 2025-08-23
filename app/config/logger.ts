import winston, { level } from "winston";

class logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static logger(): winston.Logger {
    if (!logger.instance) {
      logger.instance = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
            ],
        });

    }
    return logger.instance;
  }
}

export default logger;
