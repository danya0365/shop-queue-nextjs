import { QueueStatsDTO } from "@/src/application/dtos/backend/queues-dto";
import { Logger } from "../../../../domain/interfaces/logger";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

/**
 * Use case for getting queue statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueStatsUseCase implements IUseCase<void, QueueStatsDTO> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get queue statistics
   * @returns Queue statistics
   */
  async execute(): Promise<QueueStatsDTO> {
    try {
      this.logger.info('GetQueueStatsUseCase.execute');
      return await this.queueRepository.getQueueStats();
    } catch (error) {
      this.logger.error('Error in GetQueueStatsUseCase.execute', { error });
      throw error;
    }
  }
}
