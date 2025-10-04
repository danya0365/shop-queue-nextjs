import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { CustomerQueueStatusRepository } from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";

export class CancelCustomerQueueByIdUseCase
  implements IUseCase<{ queueId: string; customerId: string }, boolean>
{
  constructor(private readonly repository: CustomerQueueStatusRepository) {}

  async execute(input: { queueId: string; customerId: string }): Promise<boolean> {
    const { queueId, customerId } = input;
    if (!queueId) throw new Error("queueId is required");
    if (!customerId) throw new Error("customerId is required");
    return this.repository.cancelCustomerQueueById(queueId, customerId);
  }
}
