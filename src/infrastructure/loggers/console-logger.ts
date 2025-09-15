
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
    
    // Handle the main error parameter
    if (error !== undefined) {
      params.push(...this.formatErrorObject(error, 'Error'));
    }
    
    // Handle context and check for nested error objects
    if (context !== undefined && Object.keys(context).length > 0) {
      const processedContext = this.processContextForErrors(context);
      params.push('\nContext:', processedContext);
    }
    
    return params;
  }
  
  /**
   * Format an error object for logging
   * @param error The error object to format
   * @param prefix Prefix for the error message
   * @returns Array of formatted error strings
   */
  private formatErrorObject(error: Error | unknown, prefix: string = 'Error'): string[] {
    const result: string[] = [];
    
    if (error instanceof Error) {
      result.push(`\n${prefix}: ${error.message}`);
      if (error.stack) {
        result.push(`\nStack: ${error.stack}`);
      }
    } else if (error !== null && typeof error === 'object') {
      // Handle object errors that might have message property
      const errorObj = error as Record<string, unknown>;
      if ('message' in errorObj && typeof errorObj.message === 'string') {
        result.push(`\n${prefix}: ${errorObj.message}`);
      } else {
        // Try to serialize the object safely
        try {
          const errorString = JSON.stringify(error, null, 2);
          result.push(`\n${prefix}: ${errorString}`);
        } catch {
          // Fallback to String conversion if JSON.stringify fails
          result.push(`\n${prefix}: ${String(error)}`);
        }
      }
    } else if (error !== null) {
      result.push(`\n${prefix}: ${String(error)}`);
    }
    
    return result;
  }
  
  /**
   * Process context object to handle nested error objects
   * @param context The context object to process
   * @returns Processed context with properly formatted errors
   */
  private processContextForErrors(context: LogContext): LogContext {
    const processedContext: LogContext = {};
    
    for (const [key, value] of Object.entries(context)) {
      if (value instanceof Error) {
        // Format Error objects in context
        processedContext[key] = {
          message: value.message,
          stack: value.stack,
          name: value.name
        };
      } else if (value !== null && typeof value === 'object' && 'message' in (value as Record<string, unknown>)) {
        // Handle error-like objects in context
        const errorObj = value as Record<string, unknown>;
        const errorDetails: Record<string, unknown> = {
          message: typeof errorObj.message === 'string' ? errorObj.message : String(errorObj.message)
        };
        
        if (errorObj.stack && typeof errorObj.stack === 'string') {
          errorDetails.stack = errorObj.stack;
        }
        
        if (errorObj.name && typeof errorObj.name === 'string') {
          errorDetails.name = errorObj.name;
        }
        
        processedContext[key] = errorDetails;
      } else {
        // Keep other values as-is
        processedContext[key] = value;
      }
    }
    
    return processedContext;
  }
}
