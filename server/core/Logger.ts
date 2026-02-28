import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf(({ level, message, timestamp, service }) => {
  return `${timestamp} [${service || 'AURION'}] ${level.toUpperCase()}: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'combined.log') }),
  ],
});

export const createLogger = (service: string) => {
  return logger.child({ service });
};
