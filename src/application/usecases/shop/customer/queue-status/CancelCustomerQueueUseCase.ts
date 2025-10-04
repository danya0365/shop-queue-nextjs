import type { IUseCase } from "../../../../interfaces/use-case.interface";
import { CustomerQueueStatusError, CustomerQueueStatusErrorType } from "../../../../../domain/errors/customer-queue-status-error";
import type { CancelCustomerQueueInputDTO } from "../../../../dtos/shop/customer/customer-queue-status-dto";

export class CancelCustomerQueueUseCase implements IUseCase<CancelCustomerQueueInputDTO, boolean> {
  constructor() {}

  async execute(input: CancelCustomerQueueInputDTO): Promise<boolean> {
    // Deprecated path: queue-number based cancellation is no longer supported.
    // Use cancel-by-id with explicit customer ownership instead.
    throw new CustomerQueueStatusError(
      CustomerQueueStatusErrorType.VALIDATION_ERROR,
      "Deprecated: Use cancel by queueId and customerId instead",
      "CancelCustomerQueueUseCase.execute",
      { shopId: input.shopId, queueNumber: input.queueNumber }
    );
  }
}
