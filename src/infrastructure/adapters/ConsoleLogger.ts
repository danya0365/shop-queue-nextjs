import { Logger, LogLevel, LogContext } from '@/src/domain/interfaces/logger';

/**
 * Console Logger implementation that directly implements the Logger interface
 * This is a simple implementation for development and basic logging needs
 */
export class ConsoleLogger implements Logger {
  /**
   * Log a message at the INFO level
   * @param message The message to log
   * @param context Optional context data
   */
  info(message: string, context?: LogContext): void {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  /**
   * Log a message at the WARN level
   * @param message The message to log
   * @param context Optional context data
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  /**
   * Log a message at the ERROR level
   * @param message The message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error, context ? JSON.stringify(context, null, 2) : '');
  }

  /**
   * Log a message at the DEBUG level
   * @param message The message to log
   * @param context Optional context data
   */
  debug(message: string, context?: LogContext): void {
    console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context, null, 2) : '');
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
