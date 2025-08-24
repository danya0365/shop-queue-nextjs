import { ILogger } from '@/src/application/interfaces/logger.interface';
import { LogContext, Logger, LogLevel } from "@/src/domain/interfaces/logger";

/**
 * Adapter that converts ILogger to Logger interface
 * This follows the Adapter pattern to bridge the gap between two different logger interfaces
 */
export class LoggerAdapter implements Logger {
  constructor(private readonly logger: ILogger) { }

  /**
   * Log a message at the INFO level
   * @param message The message to log
   * @param context Optional context data
   */
  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  /**
   * Log a message at the WARN level
   * @param message The message to log
   * @param context Optional context data
   */
  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  /**
   * Log a message at the ERROR level
   * @param message The message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.logger.error(message, error as Error, context);
  }

  /**
   * Log a message at the DEBUG level
   * @param message The message to log
   * @param context Optional context data
   */
  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  /**
   * Log a message at the specified level
   * @param level The log level
   * @param message The message to log
   * @param context Optional context data
   */
  log(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case LogLevel.INFO:
        this.info(message, context);
        break;
      case LogLevel.WARN:
        this.warn(message, context);
        break;
      case LogLevel.ERROR:
        this.error(message, undefined, context);
        break;
      case LogLevel.DEBUG:
        this.debug(message, context);
        break;
      default:
        this.info(message, context);
    }
  }
}
