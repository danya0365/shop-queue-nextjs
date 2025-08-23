
import { LogContext, LogLevel } from '@/src/domain/interfaces/logger';
import { BaseLogger } from './base-logger';

/**
 * Console implementation of the Logger interface
 * Following CLEAN Architecture and SOLID principles by extending the BaseLogger
 * abstract class from the core layer
 */
export class ConsoleLogger extends BaseLogger {
  /**
   * Implementation of the abstract logMessage method
   * @param level Log level
   * @param message Message to log
   * @param error Optional error object
   * @param context Optional context data
   */
  protected logMessage(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case LogLevel.INFO:
        console.info(formattedMessage, ...(this.formatLogParams(error, context)));
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...(this.formatLogParams(error, context)));
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...(this.formatLogParams(error, context)));
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...(this.formatLogParams(error, context)));
        break;
      default:
        console.log(formattedMessage, ...(this.formatLogParams(error, context)));
    }
  }
  
  /**
   * Helper method to format log parameters
   * @param error Optional error object
   * @param context Optional context data
   * @returns Array of parameters for console methods
   */
  private formatLogParams(error?: Error | unknown, context?: LogContext): unknown[] {
    const params: unknown[] = [];
    
    if (error !== undefined) {
      if (error instanceof Error) {
        params.push(`\nError: ${error.message}`);
        if (error.stack) {
          params.push(`\nStack: ${error.stack}`);
        }
      } else if (error !== null) {
        params.push(`\nError: ${String(error)}`);
      }
    }
    
    if (context !== undefined && Object.keys(context).length > 0) {
      params.push('\nContext:', context);
    }
    
    return params;
  }
}
