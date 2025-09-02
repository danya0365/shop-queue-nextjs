import { CreateQueueInput, QueueDTO } from "@/src/application/dtos/backend/queues-dto";
import { CreateQueueEntity } from "@/src/domain/entities/backend/backend-queue.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";


/**
 * Use case for creating a new queue
 * Following SOLID principles and Clean Architecture
 */
export class CreateQueueUseCase implements IUseCase<CreateQueueInput, QueueDTO> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to create a new queue
   * @param input Queue data to create
   * @returns Created queue dto
   */
  async execute(input: CreateQueueInput): Promise<QueueDTO> {
    try {
      // Map input to domain entity format expected by repository
      const queueToCreate: CreateQueueEntity = {
        customerId: input.customerId,
        shopId: input.shopId,
        queueNumber: input.queueNumber,
        status: input.status,
        priority: input.priority,
        estimatedWaitTime: input.estimatedWaitTime,
        notes: input.notes,
        queueServices: input.queueServices.map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price
        }))
      };

      const createdQueue = await this.queueRepository.createQueue(queueToCreate);
      const queueDTO: QueueDTO = {
        id: createdQueue.id,
        customerId: createdQueue.customerId,
        customerName: createdQueue.customerName,
        customerPhone: createdQueue.customerPhone,
        shopId: createdQueue.shopId,
        shopName: createdQueue.shopName,
        queueServices: createdQueue.queueServices,
        queueNumber: createdQueue.queueNumber,
        status: createdQueue.status,
        priority: createdQueue.priority,
        estimatedWaitTime: createdQueue.estimatedWaitTime,
        actualWaitTime: createdQueue.actualWaitTime,
        notes: createdQueue.notes,
        createdAt: createdQueue.createdAt,
        updatedAt: createdQueue.updatedAt,
        calledAt: createdQueue.calledAt,
        completedAt: createdQueue.completedAt
      };
      return queueDTO;
    } catch (error) {
      this.logger.error('Error in CreateQueueUseCase.execute', { error, input });
      throw error;
    }
  }
}
