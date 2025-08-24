/**
 * Base error class for domain-specific errors
 * Following SOLID principles by providing a common error structure
 */
export abstract class BaseError extends Error {
  constructor(
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
