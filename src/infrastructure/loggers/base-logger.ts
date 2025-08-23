import { LogContext, Logger, LogLevel } from '../../domain/interfaces/logger';

/**
 * Abstract base logger class that implements the Logger interface
 * Provides common functionality for all logger implementations
 * Following the Template Method pattern from SOLID principles
 */
export abstract class BaseLogger implements Logger {
  /**
   * Abstract method to be implemented by concrete loggers
   * @param level Log level
   * @param message Message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  protected abstract logMessage(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ): void;

  /**
   * Log a message at the INFO level
   * @param message The message to log
   * @param context Optional context data
   */
  public info(message: string, context?: LogContext): void {
    this.logMessage(LogLevel.INFO, message, undefined, context);
  }

  /**
   * Log a message at the WARN level
   * @param message The message to log
   * @param context Optional context data
   */
  public warn(message: string, context?: LogContext): void {
    this.logMessage(LogLevel.WARN, message, undefined, context);
  }

  /**
   * Log a message at the ERROR level
   * @param message The message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  public error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.logMessage(LogLevel.ERROR, message, error, context);
  }

  /**
   * Log a message at the DEBUG level
   * @param message The message to log
   * @param context Optional context data
   */
  public debug(message: string, context?: LogContext): void {
    this.logMessage(LogLevel.DEBUG, message, undefined, context);
  }

  /**
   * Log a message at the specified level
   * @param level The log level
   * @param message The message to log
   * @param context Optional context data
   */
  public log(level: LogLevel, message: string, context?: LogContext): void {
    this.logMessage(level, message, undefined, context);
  }
}
