import type { CustomerQueueStatusRepository } from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import {
  CustomerQueueStatusError,
  CustomerQueueStatusErrorType,
} from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { 
  IsQueueOwnerInputDTO, 
  IsQueueOwnerOutputDTO 
} from "@/src/application/dtos/shop/customer/customer-queue-status-dto";

/**
 * Use case to check if a customer is the owner of a queue
 */
export class IsQueueOwnerUseCase implements IUseCase<IsQueueOwnerInputDTO, IsQueueOwnerOutputDTO> {
  constructor(
    private readonly repository: CustomerQueueStatusRepository,
  ) {}

  async execute(input: IsQueueOwnerInputDTO): Promise<IsQueueOwnerOutputDTO> {
    try {
      return await this.repository.isQueueOwner(input.queueId, input.customerId);
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }
      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        'Failed to check queue ownership',
        'IsQueueOwnerUseCase.execute',
        { queueId: input.queueId, customerId: input.customerId },
        error
      );
    }
  }
}
