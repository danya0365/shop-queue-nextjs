import { IUseCase } from '../interfaces/use-case.interface';

/**
 * Base exception class for application layer
 * Provides consistent error handling across the application
 */
export class ApplicationException extends Error {
  /**
   * Constructor
   * @param message Error message
   * @param cause Original error that caused this exception
   */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error handling decorator for use cases
 * Follows Decorator Pattern to separate error handling concerns from business logic
 */
export class ErrorHandlingDecorator<TInput, TOutput> implements IUseCase<TInput, TOutput> {
  /**
   * Constructor with dependency injection
   * @param useCase The use case to decorate
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly useCase: IUseCase<TInput, TOutput>,
    private readonly logger?: { error: (message: string, error?: Error) => void }
  ) {}

  /**
   * Execute the use case with error handling
   * @param input The input data for the use case
   * @returns A promise that resolves to the output data
   * @throws ApplicationException if an error occurs
   */
  async execute(input?: TInput): Promise<TOutput> {
    try {
      return await this.useCase.execute(input);
    } catch (error) {
      // Log the error if a logger is provided
      if (this.logger) {
        this.logger.error(
          `Error executing use case ${this.useCase.constructor.name}:`,
          error as Error
        );
      }

      // If it's already an ApplicationException, rethrow it
      if (error instanceof ApplicationException) {
        throw error;
      }

      // Otherwise, wrap it in a generic ApplicationException
      throw new ApplicationException(
        `An error occurred while executing ${this.useCase.constructor.name}`,
        error as Error
      );
    }
  }
}
