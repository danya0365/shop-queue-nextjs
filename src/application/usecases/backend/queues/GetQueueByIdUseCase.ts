import { QueueEntity } from "../../../../domain/entities/backend/backend-queue.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

/**
 * Input DTO for GetQueueByIdUseCase
 */
export interface GetQueueByIdInput {
  id: string;
}

/**
 * Use case for getting a queue by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueByIdUseCase implements IUseCase<GetQueueByIdInput, QueueEntity | null> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get a queue by ID
   * @param input Queue ID
   * @returns Queue entity or null if not found
   */
  async execute(input: GetQueueByIdInput): Promise<QueueEntity | null> {
    try {
      this.logger.info('GetQueueByIdUseCase.execute', { input });
      return await this.queueRepository.getQueueById(input.id);
    } catch (error) {
      this.logger.error('Error in GetQueueByIdUseCase.execute', { error, input });
      throw error;
    }
  }
}
