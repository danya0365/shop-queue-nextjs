/**
 * LogLevel enum for different logging levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * LogContext interface for structured logging context
 */
export interface LogContext {
  // Using unknown instead of any for better type safety
  [key: string]: unknown;
}

/**
 * Logger interface for application-wide logging
 * This is a domain-level interface that defines the logging contract
 * following CLEAN Architecture principles
 */
export interface Logger {
  /**
   * Log a message at the INFO level
   * @param message The message to log
   * @param context Optional context data
   */
  info(message: string, context?: LogContext): void;
  
  /**
   * Log a message at the WARN level
   * @param message The message to log
   * @param context Optional context data
   */
  warn(message: string, context?: LogContext): void;
  
  /**
   * Log a message at the ERROR level
   * @param message The message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void;
  
  /**
   * Log a message at the DEBUG level
   * @param message The message to log
   * @param context Optional context data
   */
  debug(message: string, context?: LogContext): void;
  
  /**
   * Log a message at the specified level
   * @param level The log level
   * @param message The message to log
   * @param context Optional context data
   */
  log(level: LogLevel, message: string, context?: LogContext): void;
}
