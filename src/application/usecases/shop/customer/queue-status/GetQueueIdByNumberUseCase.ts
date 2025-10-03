import type { CustomerQueueStatusRepository } from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import {
  CustomerQueueStatusError,
  CustomerQueueStatusErrorType,
} from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { 
  GetQueueIdByNumberInputDTO, 
  GetQueueIdByNumberOutputDTO 
} from "@/src/application/dtos/shop/customer/customer-queue-status-dto";

/**
 * Use case to get queue ID by queue number
 */
export class GetQueueIdByNumberUseCase
  implements IUseCase<GetQueueIdByNumberInputDTO, GetQueueIdByNumberOutputDTO>
{
  constructor(private readonly repository: CustomerQueueStatusRepository) {}

  async execute(input: GetQueueIdByNumberInputDTO): Promise<GetQueueIdByNumberOutputDTO> {
    try {
      return await this.repository.getQueueIdByNumber(input.shopId, input.queueNumber);
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }
      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        'Failed to get queue ID by number',
        'GetQueueIdByNumberUseCase.execute',
        { shopId: input.shopId, queueNumber: input.queueNumber },
        error
      );
    }
  }
}
