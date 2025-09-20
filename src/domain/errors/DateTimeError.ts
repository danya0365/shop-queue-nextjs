export class DateTimeError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DateTimeError';
  }
}

export enum DateTimeErrorCode {
  INVALID_DATE = 'INVALID_DATE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_LOCALE = 'INVALID_LOCALE',
  FORMAT_ERROR = 'FORMAT_ERROR'
}

export class InvalidDateError extends DateTimeError {
  constructor(date: unknown) {
    super(`Invalid date value: ${date}`, DateTimeErrorCode.INVALID_DATE);
  }
}

export class InvalidFormatError extends DateTimeError {
  constructor(format: string) {
    super(`Invalid format: ${format}`, DateTimeErrorCode.INVALID_FORMAT);
  }
}

export class InvalidLocaleError extends DateTimeError {
  constructor(locale: string) {
    super(`Invalid locale: ${locale}`, DateTimeErrorCode.INVALID_LOCALE);
  }
}
