/**
 * Logger interface for application layer
 * Follows Interface Segregation Principle
 */
export interface ILogger {
  /**
   * Log debug message
   * @param message Message to log
   * @param meta Additional metadata
   */
  debug(message: string, meta?: Record<string, unknown>): void;
  
  /**
   * Log info message
   * @param message Message to log
   * @param meta Additional metadata
   */
  info(message: string, meta?: Record<string, unknown>): void;
  
  /**
   * Log warning message
   * @param message Message to log
   * @param meta Additional metadata
   */
  warn(message: string, meta?: Record<string, unknown>): void;
  
  /**
   * Log error message
   * @param message Message to log
   * @param error Error object
   * @param meta Additional metadata
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
}
