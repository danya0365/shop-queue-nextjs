import type { IUseCase } from "../../../../interfaces/use-case.interface";
import { CustomerQueueStatusMapper } from "../../../../mappers/shop/customer/customer-queue-status-mapper";
import type { CustomerQueueStatusRepository } from "../../../../../domain/repositories/shop/customer/customer-queue-status-repository";
import { CustomerQueueStatusError, CustomerQueueStatusErrorType } from "../../../../../domain/errors/customer-queue-status-error";
import type { QueueProgressDTO } from "../../../../dtos/shop/customer/customer-queue-status-dto";

export class GetQueueProgressUseCase implements IUseCase<
  {
    shopId: string;
  },
  QueueProgressDTO
> {
  constructor(
    private readonly customerQueueStatusRepository: CustomerQueueStatusRepository
  ) {}

  async execute(input: {
    shopId: string;
  }): Promise<QueueProgressDTO> {
    try {
      if (!input.shopId) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetQueueProgressUseCase.execute",
          { shopId: input.shopId }
        );
      }

      const queueProgress = await this.customerQueueStatusRepository.getQueueProgress(input.shopId);

      return CustomerQueueStatusMapper.toProgressDTO(queueProgress);
    } catch (error: unknown) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to get queue progress",
        "GetQueueProgressUseCase.execute",
        { shopId: input.shopId },
        error instanceof Error ? error : undefined
      );
    }
  }
}
