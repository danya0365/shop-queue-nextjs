/**
 * Generic interface for all use cases following Command Pattern
 * This enforces a consistent structure across all use cases
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Execute the use case with the given input
   * @param input The input data for the use case
   * @returns A promise that resolves to the output data
   */
  execute(input?: TInput): Promise<TOutput>;
}

/**
 * Interface for use cases that don't require input
 */
export interface INoInputUseCase<TOutput> extends IUseCase<void, TOutput> {
  execute(): Promise<TOutput>;
}

/**
 * Interface for use cases that don't return output
 */
export interface INoOutputUseCase<TInput> extends IUseCase<TInput, void> {
  execute(input: TInput): Promise<void>;
}

/**
 * Interface for simple use cases that neither require input nor return output
 */
export interface ISimpleUseCase extends IUseCase<void, void> {
  execute(): Promise<void>;
}
