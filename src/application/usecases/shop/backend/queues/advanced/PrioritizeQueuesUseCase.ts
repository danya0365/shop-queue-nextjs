import {
  PrioritizeQueuesInput,
  PrioritizeQueuesResult,
} from "@/src/application/dtos/shop/backend/queue-advanced-dto";
import { UpdateQueueInput } from "@/src/application/dtos/shop/backend/queues-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueMapper } from "@/src/application/mappers/shop/backend/queue-mapper";
import { QueuePriority } from "@/src/domain/entities/backend/backend-queue.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopBackendQueueError,
  ShopBackendQueueErrorType,
  ShopBackendQueueRepository,
} from "@/src/domain/repositories/shop/backend/backend-queue-repository";

/**
 * Use case for prioritizing queues based on various criteria
 * Following SOLID principles and Clean Architecture
 */
export class PrioritizeQueuesUseCase
  implements IUseCase<PrioritizeQueuesInput, PrioritizeQueuesResult>
{
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) {}

  /**
   * Execute the use case to prioritize queues
   * @param input Prioritize input
   * @returns Prioritize result
   */
  async execute(input: PrioritizeQueuesInput): Promise<PrioritizeQueuesResult> {
    try {
      // Validate input
      if (!input.shopId) {
        throw new Error("Shop ID is required");
      }

      if (!input.queues || input.queues.length === 0) {
        throw new Error("Queues are required");
      }

      this.logger.info("Starting prioritize queues", {
        shopId: input.shopId,
        queueCount: input.queues.length,
        strategy: input.strategy || "wait-time",
      });

      // Get current queues from repository
      const currentQueues = await this.getCurrentQueues(
        input.shopId,
        input.departmentId
      );

      // Calculate priority scores for each queue
      const prioritizedQueues = this.calculatePriorities(
        currentQueues,
        input.queues,
        input.strategy || "wait-time"
      );

      // Update queue priorities in repository
      const updatedQueues = await this.updateQueuePriorities(prioritizedQueues);

      let highPriorityCount = 0;
      let normalPriorityCount = 0;
      let urgentPriorityCount = 0;

      prioritizedQueues.forEach((queue) => {
        if (queue.priority === "high") {
          highPriorityCount++;
        } else if (queue.priority === "normal") {
          normalPriorityCount++;
        } else if (queue.priority === "urgent") {
          urgentPriorityCount++;
        }
      });

      const result: PrioritizeQueuesResult = {
        success: true,
        shopId: input.shopId,
        prioritizedQueues: prioritizedQueues,
        strategy: input.strategy || "wait-time",
        summary: {
          totalQueues: prioritizedQueues.length,
          highPriorityCount,
          normalPriorityCount,
          urgentPriorityCount,
        },
      };

      this.logger.info("Prioritize queues completed", {
        result: {
          shopId: result.shopId,
          totalQueues: result.summary.totalQueues,
          highPriorityCount: result.summary.highPriorityCount,
          normalPriorityCount: result.summary.normalPriorityCount,
          urgentPriorityCount: result.summary.urgentPriorityCount,
          strategy: result.strategy,
        },
      });

      return result;
    } catch (error) {
      this.logger.error("Failed to prioritize queues", { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        "Failed to prioritize queues",
        "prioritizeQueues",
        { input },
        error
      );
    }
  }

  /**
   * Get current queues from repository
   * @param shopId Shop ID
   * @param departmentId Department ID
   * @returns Array of current queues
   */
  private async getCurrentQueues(
    shopId: string,
    departmentId?: string
  ): Promise<any[]> {
    try {
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 1000,
        filters: {
          shopId,
          statusFilter: "waiting", // Only prioritize waiting queues
        },
      });

      return queues.data;
    } catch (error) {
      this.logger.error("Failed to get current queues", {
        error,
        shopId,
        departmentId,
      });
      throw error;
    }
  }

  /**
   * Calculate priority scores for queues
   * @param currentQueues Current queues
   * @param inputQueues Input queues to prioritize
   * @param strategy Priority strategy
   * @returns Array of prioritized queues
   */
  private calculatePriorities(
    currentQueues: any[],
    inputQueues: Array<{ queueId: string }>,
    strategy: string
  ): Array<{
    queueId: string;
    priority: QueuePriority;
    score: number;
    reason: string;
  }> {
    return inputQueues.map((inputQueue) => {
      const currentQueue = currentQueues.find(
        (q) => q.id === inputQueue.queueId
      );

      if (!currentQueue) {
        return {
          queueId: inputQueue.queueId,
          priority: QueuePriority.NORMAL,
          score: 50,
          reason: "Queue not found in current list",
        };
      }

      const priorityResult = this.calculateQueuePriority(
        currentQueue,
        strategy
      );

      return {
        queueId: inputQueue.queueId,
        priority: priorityResult.priority,
        score: priorityResult.score,
        reason: priorityResult.reason,
      };
    });
  }

  /**
   * Calculate priority for a single queue
   * @param queue Queue to calculate priority for
   * @param strategy Priority strategy
   * @returns Priority result
   */
  private calculateQueuePriority(
    queue: any,
    strategy: string
  ): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    switch (strategy) {
      case "wait-time":
        return this.calculateWaitTimePriority(queue);
      case "customer-tier":
        return this.calculateCustomerTierPriority(queue);
      case "service-complexity":
        return this.calculateServiceComplexityPriority(queue);
      case "revenue":
        return this.calculateRevenuePriority(queue);
      case "combined":
        return this.calculateCombinedPriority(queue);
      default:
        return this.calculateWaitTimePriority(queue);
    }
  }

  /**
   * Calculate priority based on wait time
   * @param queue Queue to calculate priority for
   * @returns Priority result
   */
  private calculateWaitTimePriority(queue: any): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    const waitTime = queue.actualWaitTime || 0;

    if (waitTime > 30) {
      return {
        priority: QueuePriority.HIGH,
        score: 90,
        reason: `Long wait time: ${waitTime} minutes`,
      };
    } else if (waitTime > 15) {
      return {
        priority: QueuePriority.HIGH,
        score: 60,
        reason: `Moderate wait time: ${waitTime} minutes`,
      };
    } else {
      return {
        priority: QueuePriority.NORMAL,
        score: 30,
        reason: `Short wait time: ${waitTime} minutes`,
      };
    }
  }

  /**
   * Calculate priority based on customer tier
   * @param queue Queue to calculate priority for
   * @returns Priority result
   */
  private calculateCustomerTierPriority(queue: any): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    const customerTier = queue.customer?.membershipTier || "regular";

    switch (customerTier) {
      case "vip":
        return {
          priority: QueuePriority.HIGH,
          score: 90,
          reason: "VIP customer",
        };
      case "premium":
        return {
          priority: QueuePriority.HIGH,
          score: 80,
          reason: "Premium customer",
        };
      case "gold":
        return {
          priority: QueuePriority.HIGH,
          score: 70,
          reason: "Gold customer",
        };
      case "silver":
        return {
          priority: QueuePriority.HIGH,
          score: 60,
          reason: "Silver customer",
        };
      default:
        return {
          priority: QueuePriority.NORMAL,
          score: 40,
          reason: "Regular customer",
        };
    }
  }

  /**
   * Calculate priority based on service complexity
   * @param queue Queue to calculate priority for
   * @returns Priority result
   */
  private calculateServiceComplexityPriority(queue: any): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    const serviceComplexity = this.calculateServiceComplexity(queue);

    if (serviceComplexity > 80) {
      return {
        priority: QueuePriority.HIGH,
        score: 85,
        reason: `High complexity service: ${serviceComplexity}%`,
      };
    } else if (serviceComplexity > 50) {
      return {
        priority: QueuePriority.HIGH,
        score: 60,
        reason: `Medium complexity service: ${serviceComplexity}%`,
      };
    } else {
      return {
        priority: QueuePriority.NORMAL,
        score: 35,
        reason: `Low complexity service: ${serviceComplexity}%`,
      };
    }
  }

  /**
   * Calculate priority based on revenue
   * @param queue Queue to calculate priority for
   * @returns Priority result
   */
  private calculateRevenuePriority(queue: any): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    const revenue = this.calculateQueueRevenue(queue);

    if (revenue > 1000) {
      return {
        priority: QueuePriority.HIGH,
        score: 90,
        reason: `High revenue: ${revenue} THB`,
      };
    } else if (revenue > 500) {
      return {
        priority: QueuePriority.HIGH,
        score: 65,
        reason: `Medium revenue: ${revenue} THB`,
      };
    } else {
      return {
        priority: QueuePriority.NORMAL,
        score: 40,
        reason: `Low revenue: ${revenue} THB`,
      };
    }
  }

  /**
   * Calculate combined priority
   * @param queue Queue to calculate priority for
   * @returns Priority result
   */
  private calculateCombinedPriority(queue: any): {
    priority: QueuePriority;
    score: number;
    reason: string;
  } {
    const waitTimePriority = this.calculateWaitTimePriority(queue);
    const customerTierPriority = this.calculateCustomerTierPriority(queue);
    const serviceComplexityPriority =
      this.calculateServiceComplexityPriority(queue);
    const revenuePriority = this.calculateRevenuePriority(queue);

    // Weighted average
    const combinedScore =
      waitTimePriority.score * 0.3 +
      customerTierPriority.score * 0.25 +
      serviceComplexityPriority.score * 0.25 +
      revenuePriority.score * 0.2;

    let priority: QueuePriority;
    let reason: string;

    if (combinedScore >= 75) {
      priority = QueuePriority.URGENT;
      reason = `Urgent combined priority (${Math.round(combinedScore)}): ${
        waitTimePriority.reason
      }, ${customerTierPriority.reason}`;
    } else if (combinedScore >= 50) {
      priority = QueuePriority.HIGH;
      reason = `High combined priority (${Math.round(combinedScore)}): ${
        waitTimePriority.reason
      }, ${customerTierPriority.reason}`;
    } else {
      priority = QueuePriority.NORMAL;
      reason = `Normal combined priority (${Math.round(combinedScore)}): ${
        waitTimePriority.reason
      }, ${customerTierPriority.reason}`;
    }

    return {
      priority,
      score: combinedScore,
      reason,
    };
  }

  /**
   * Calculate service complexity
   * @param queue Queue to calculate complexity for
   * @returns Complexity percentage
   */
  private calculateServiceComplexity(queue: any): number {
    if (!queue.queueServices || queue.queueServices.length === 0) {
      return 0;
    }

    // Simple complexity calculation based on number of services and their types
    const serviceCount = queue.queueServices.length;
    const baseComplexity = Math.min(serviceCount * 20, 60);

    // Add complexity based on service types
    const serviceTypes = queue.queueServices
      .map((s: any) => s.serviceName || "")
      .join(" ")
      .toLowerCase();
    const typeComplexity =
      (serviceTypes.includes("complex") ? 20 : 0) +
      (serviceTypes.includes("premium") ? 15 : 0) +
      (serviceTypes.includes("special") ? 10 : 0);

    return Math.min(baseComplexity + typeComplexity, 100);
  }

  /**
   * Calculate queue revenue
   * @param queue Queue to calculate revenue for
   * @returns Revenue amount
   */
  private calculateQueueRevenue(queue: any): number {
    if (!queue.queueServices || queue.queueServices.length === 0) {
      return 0;
    }

    return queue.queueServices.reduce((total: number, service: any) => {
      return total + service.price * service.quantity;
    }, 0);
  }

  /**
   * Update queue priorities in repository
   * @param prioritizedQueues Array of prioritized queues
   * @returns Array of updated queue DTOs
   */
  private async updateQueuePriorities(
    prioritizedQueues: Array<{
      queueId: string;
      priority: QueuePriority;
      score: number;
      reason: string;
    }>
  ): Promise<UpdateQueueInput[]> {
    const updatedQueues: UpdateQueueInput[] = [];

    for (const prioritizedQueue of prioritizedQueues) {
      try {
        const updatedQueue = await this.queueRepository.updateQueue(
          prioritizedQueue.queueId,
          {
            priority: prioritizedQueue.priority,
          }
        );

        updatedQueues.push(QueueMapper.toDTO(updatedQueue));
      } catch (error) {
        this.logger.error("Failed to update queue priority", {
          queueId: prioritizedQueue.queueId,
          error,
        });
        // Continue with other queues even if one fails
      }
    }

    return updatedQueues;
  }
}
