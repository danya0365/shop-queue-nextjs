import type { IUseCase } from "../../../../interfaces/use-case.interface";
import { CustomerQueueStatusError, CustomerQueueStatusErrorType } from "../../../../../domain/errors/customer-queue-status-error";
import type { CustomerQueueStatusRepository } from "../../../../../domain/repositories/shop/customer/customer-queue-status-repository";
import type { CancelCustomerQueueInputDTO } from "../../../../dtos/shop/customer/customer-queue-status-dto";

export class CancelCustomerQueueUseCase implements IUseCase<CancelCustomerQueueInputDTO, boolean> {
  constructor(
    private readonly customerQueueStatusRepository: CustomerQueueStatusRepository
  ) {}

  async execute(input: CancelCustomerQueueInputDTO): Promise<boolean> {
    try {
      if (!input.shopId) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "CancelCustomerQueueUseCase.execute",
          { shopId: input.shopId }
        );
      }

      if (!input.queueNumber) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Queue number is required",
          "CancelCustomerQueueUseCase.execute",
          { queueNumber: input.queueNumber }
        );
      }

      const result = await this.customerQueueStatusRepository.cancelCustomerQueue(input.shopId, input.queueNumber);

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to cancel customer queue",
        "CancelCustomerQueueUseCase.execute",
        { shopId: input.shopId, queueNumber: input.queueNumber },
        error instanceof Error ? error : undefined
      );
    }
  }
}
