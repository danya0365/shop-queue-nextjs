export enum CustomerQueueStatusErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OPERATION_FAILED = 'OPERATION_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export class CustomerQueueStatusError extends Error {
  public readonly type: CustomerQueueStatusErrorType;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    type: CustomerQueueStatusErrorType,
    message: string,
    operation?: string,
    details?: Record<string, any>,
    originalError?: Error
  ) {
    super(message);
    this.name = 'CustomerQueueStatusError';
    this.type = type;
    this.code = type;
    this.details = {
      operation,
      ...details
    };

    if (originalError) {
      this.stack = originalError.stack;
    }
  }

  static notFound(id: string, operation?: string): CustomerQueueStatusError {
    return new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.NOT_FOUND,
      `Customer queue status not found`,
      operation,
      { id }
    );
  }

  static validationError(message: string, operation?: string, details?: Record<string, any>): CustomerQueueStatusError {
    return new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.VALIDATION_ERROR,
      message,
      operation,
      details
    );
  }

  static operationFailed(message: string, operation?: string, details?: Record<string, any>, originalError?: Error): CustomerQueueStatusError {
    return new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.OPERATION_FAILED,
      message,
      operation,
      details,
      originalError
    );
  }

  static databaseError(message: string, operation?: string, details?: Record<string, any>, originalError?: Error): CustomerQueueStatusError {
    return new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.DATABASE_ERROR,
      message,
      operation,
      details,
      originalError
    );
  }

  static unauthorized(message: string, operation?: string, details?: Record<string, any>): CustomerQueueStatusError {
    return new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.UNAUTHORIZED,
      message,
      operation,
      details
    );
  }
}
