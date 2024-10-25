import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, context }) => {
            return `[${timestamp} [${level}] [${context || 'app'}]]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
    ],
});

export default logger;