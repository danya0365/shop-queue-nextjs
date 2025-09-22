import type { IUseCase } from "../../../../interfaces/use-case.interface";
import { CustomerQueueStatusMapper } from "../../../../mappers/shop/customer/customer-queue-status-mapper";
import type { CustomerQueueStatusRepository } from "../../../../../domain/repositories/shop/customer/customer-queue-status-repository";
import { CustomerQueueStatusError, CustomerQueueStatusErrorType } from "../../../../../domain/errors/customer-queue-status-error";
import type { CustomerQueueStatusDTO } from "../../../../dtos/shop/customer/customer-queue-status-dto";

export class GetCustomerQueueStatusUseCase implements IUseCase<
  {
    shopId: string;
    queueId?: string;
  },
  CustomerQueueStatusDTO | null
> {
  constructor(
    private readonly customerQueueStatusRepository: CustomerQueueStatusRepository
  ) {}

  async execute(input: {
    shopId: string;
    queueId?: string;
  }): Promise<CustomerQueueStatusDTO | null> {
    try {
      if (!input.shopId) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerQueueStatusUseCase.execute",
          { shopId: input.shopId }
        );
      }

      if (!input.queueId) {
        return null;
      }

      const customerQueueStatus = await this.customerQueueStatusRepository.getCustomerQueueStatus(
        input.shopId,
        input.queueId
      );

      if (!customerQueueStatus) {
        return null;
      }

      return CustomerQueueStatusMapper.toDTO(customerQueueStatus);
    } catch (error: unknown) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to get customer queue status",
        "GetCustomerQueueStatusUseCase.execute",
        { shopId: input.shopId, queueId: input.queueId },
        error instanceof Error ? error : undefined
      );
    }
  }
}
