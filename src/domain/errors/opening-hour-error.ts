export enum OpeningHourErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_DAY = 'DUPLICATE_DAY',
  INVALID_TIME_RANGE = 'INVALID_TIME_RANGE',
  INVALID_BREAK_TIME = 'INVALID_BREAK_TIME',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export class OpeningHourError extends Error {
  public readonly type: OpeningHourErrorType;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    type: OpeningHourErrorType,
    message: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'OpeningHourError';
    this.type = type;
    this.code = type;
    this.details = details;
  }

  static notFound(id: string): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.NOT_FOUND,
      `Opening hour with ID ${id} not found`,
      { id }
    );
  }

  static validationError(message: string, details?: Record<string, any>): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.VALIDATION_ERROR,
      message,
      details
    );
  }

  static duplicateDay(dayOfWeek: string, shopId: string): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.DUPLICATE_DAY,
      `Opening hour for ${dayOfWeek} already exists for shop ${shopId}`,
      { dayOfWeek, shopId }
    );
  }

  static invalidTimeRange(openTime: string, closeTime: string): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.INVALID_TIME_RANGE,
      `Invalid time range: ${openTime} - ${closeTime}`,
      { openTime, closeTime }
    );
  }

  static invalidBreakTime(breakStart: string, breakEnd: string, openTime: string, closeTime: string): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.INVALID_BREAK_TIME,
      `Break time ${breakStart} - ${breakEnd} is not within operating hours ${openTime} - ${closeTime}`,
      { breakStart, breakEnd, openTime, closeTime }
    );
  }

  static databaseError(message: string, details?: Record<string, any>): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.DATABASE_ERROR,
      message,
      details
    );
  }

  static unauthorized(shopId: string): OpeningHourError {
    return new OpeningHourError(
      OpeningHourErrorType.UNAUTHORIZED,
      `Unauthorized access to shop ${shopId}`,
      { shopId }
    );
  }
}
