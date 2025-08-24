/**
 * Custom exceptions for profile-related operations
 * Following Clean Architecture principles by creating domain-specific exceptions
 */

export class ProfileNotFoundException extends Error {
  constructor(id: string) {
    super(`Profile with ID ${id} not found`);
    this.name = 'ProfileNotFoundException';
  }
}

export class ProfileAlreadyExistsException extends Error {
  constructor(username: string) {
    super(`Profile with username "${username}" already exists`);
    this.name = 'ProfileAlreadyExistsException';
  }
}

export class ProfileRepositoryException extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(`Profile repository error: ${message}`);
    this.name = 'ProfileRepositoryException';
  }
}

export class InvalidProfileDataException extends Error {
  constructor(message: string) {
    super(`Invalid profile data: ${message}`);
    this.name = 'InvalidProfileDataException';
  }
}

export class ProfileOperationNotAllowedException extends Error {
  constructor(message: string) {
    super(`Operation not allowed: ${message}`);
    this.name = 'ProfileOperationNotAllowedException';
  }
}

export class ProfileValidationException extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(`Profile validation error: ${message}`);
    this.name = 'ProfileValidationException';
  }
}

export class ProfileUnauthorizedException extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(`Profile unauthorized error: ${message}`);
    this.name = 'ProfileUnauthorizedException';
  }
}
