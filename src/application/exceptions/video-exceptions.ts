/**
 * Custom exceptions for video-related operations
 * Following Clean Architecture principles by creating domain-specific exceptions
 */

export class VideoNotFoundException extends Error {
  constructor(id: string) {
    super(`Video with ID ${id} not found`);
    this.name = 'VideoNotFoundException';
  }
}

export class VideoAlreadyExistsException extends Error {
  constructor(title: string) {
    super(`Video with title "${title}" already exists`);
    this.name = 'VideoAlreadyExistsException';
  }
}

export class VideoRepositoryException extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(`Video repository error: ${message}`);
    this.name = 'VideoRepositoryException';
  }
}

export class InvalidVideoDataException extends Error {
  constructor(message: string) {
    super(`Invalid video data: ${message}`);
    this.name = 'InvalidVideoDataException';
  }
}

export class VideoOperationNotAllowedException extends Error {
  constructor(message: string) {
    super(`Operation not allowed: ${message}`);
    this.name = 'VideoOperationNotAllowedException';
  }
}
