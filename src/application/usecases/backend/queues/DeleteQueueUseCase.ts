import { Logger } from "../../../../domain/interfaces/logger";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

/**
 * Input DTO for DeleteQueueUseCase
 */
export interface DeleteQueueInput {
  id: string;
}

/**
 * Use case for deleting a queue
 * Following SOLID principles and Clean Architecture
 */
export class DeleteQueueUseCase implements IUseCase<DeleteQueueInput, boolean> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to delete a queue
   * @param input Queue ID to delete
   * @returns true if deleted, false if not found
   */
  async execute(input: DeleteQueueInput): Promise<boolean> {
    try {
      this.logger.info('DeleteQueueUseCase.execute', { input });
      return await this.queueRepository.deleteQueue(input.id);
    } catch (error) {
      this.logger.error('Error in DeleteQueueUseCase.execute', { error, input });
      throw error;
    }
  }
}
