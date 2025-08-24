import { ZodFormattedError } from 'zod';
import { CreateLikeInputDto } from '../dtos/like-dto';

/**
 * Base exception class for like-related errors
 */
export class LikeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LikeException';
  }
}

/**
 * Exception thrown when like validation fails
 */
export class LikeValidationException extends LikeException {
  readonly errors: ZodFormattedError<CreateLikeInputDto>;

  constructor(errors: ZodFormattedError<CreateLikeInputDto>) {
    super('Like validation failed');
    this.name = 'LikeValidationException';
    this.errors = errors;
  }
}

/**
 * Exception thrown when a like is not found
 */
export class LikeNotFoundException extends LikeException {
  constructor(id: string) {
    super(`Like with ID ${id} not found`);
    this.name = 'LikeNotFoundException';
  }
}

/**
 * Exception thrown when there's an error in the like repository
 */
export class LikeRepositoryException extends LikeException {
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'LikeRepositoryException';
    this.cause = cause;
  }
}

/**
 * Exception thrown when a like already exists
 */
export class LikeAlreadyExistsException extends LikeException {
  constructor(profileId: string, videoId: string) {
    super(`Like for profile ${profileId} and video ${videoId} already exists`);
    this.name = 'LikeAlreadyExistsException';
  }
}
