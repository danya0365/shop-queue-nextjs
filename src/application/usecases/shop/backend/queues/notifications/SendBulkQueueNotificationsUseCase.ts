import { SendBulkQueueNotificationsInput, SendBulkQueueNotificationsResult } from '@/src/application/dtos/shop/backend/queue-notification-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SendQueueNotificationUseCase } from './SendQueueNotificationUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for sending bulk queue notifications to multiple customers
 * Following SOLID principles and Clean Architecture
 */
export class SendBulkQueueNotificationsUseCase implements IUseCase<SendBulkQueueNotificationsInput, SendBulkQueueNotificationsResult> {
  constructor(
    private readonly sendNotificationUseCase: SendQueueNotificationUseCase,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to send bulk queue notifications
   * @param input Bulk notification input
   * @returns Bulk notification result
   */
  async execute(input: SendBulkQueueNotificationsInput): Promise<SendBulkQueueNotificationsResult> {
    try {
      // Validate input
      if (!input.queueIds || input.queueIds.length === 0) {
        throw new Error('Queue IDs are required');
      }

      if (input.queueIds.length > 100) {
        throw new Error('Cannot send notifications to more than 100 queues at once');
      }

      if (!input.type) {
        throw new Error('Notification type is required');
      }

      this.logger.info('Starting send bulk queue notifications', { 
        queueCount: input.queueIds.length,
        type: input.type,
        channels: input.channels || ['sms']
      });

      // Send notifications in batches
      const results = await this.sendNotificationsInBatches(input);

      // Calculate summary
      const summary = this.calculateSummary(results);

      const result: SendBulkQueueNotificationsResult = {
        success: summary.successfulNotifications > 0,
        totalQueues: input.queueIds.length,
        type: input.type,
        channels: input.channels || ['sms'],
        results,
        summary
      };

      this.logger.info('Send bulk queue notifications completed', { 
        result: {
          totalQueues: result.totalQueues,
          successfulNotifications: result.summary.successfulNotifications,
          failedNotifications: result.summary.failedNotifications,
          successRate: result.summary.successRate
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to send bulk queue notifications', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to send bulk queue notifications',
        'sendBulkQueueNotifications',
        { input },
        error
      );
    }
  }

  /**
   * Send notifications in batches
   * @param input Bulk notification input
   * @returns Array of notification results
   */
  private async sendNotificationsInBatches(
    input: SendBulkQueueNotificationsInput
  ): Promise<Array<{
    queueId: string;
    success: boolean;
    error?: string;
    sendResults?: any;
  }>> {
    const results: Array<{
      queueId: string;
      success: boolean;
      error?: string;
      sendResults?: any;
    }> = [];

    // Process in batches to avoid overwhelming the system
    const batchSize = 10;
    const batches = this.chunkArray(input.queueIds, batchSize);

    for (const batch of batches) {
      const batchPromises = batch.map(async (queueId) => {
        try {
          const notificationInput = {
            queueId,
            type: input.type,
            channels: input.channels || ['sms'],
            customMessage: input.customMessage,
            priority: input.priority
          };

          const notificationResult = await this.sendNotificationUseCase.execute(notificationInput);

          return {
            queueId,
            success: notificationResult.success,
            sendResults: notificationResult.sendResults
          };
        } catch (error) {
          this.logger.error('Failed to send notification for queue', { 
            queueId, 
            error 
          });

          return {
            queueId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to avoid rate limiting
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Calculate summary from results
   * @param results Notification results
   * @returns Summary data
   */
  private calculateSummary(results: Array<{
    queueId: string;
    success: boolean;
    error?: string;
    sendResults?: any;
  }>): {
    successfulNotifications: number;
    failedNotifications: number;
    successRate: number;
    channelSummary: Array<{
      channel: 'sms' | 'email' | 'push';
      totalSent: number;
      successful: number;
      failed: number;
    }>;
  } {
    const successfulNotifications = results.filter(r => r.success).length;
    const failedNotifications = results.filter(r => !r.success).length;
    const successRate = results.length > 0 ? successfulNotifications / results.length : 0;

    // Calculate channel summary
    const channelStats: Record<string, {
      totalSent: number;
      successful: number;
      failed: number;
    }> = {};

    results.forEach(result => {
      if (result.sendResults && Array.isArray(result.sendResults)) {
        result.sendResults.forEach((sendResult: any) => {
          const channel = sendResult.channel;
          if (!channelStats[channel]) {
            channelStats[channel] = {
              totalSent: 0,
              successful: 0,
              failed: 0
            };
          }

          channelStats[channel].totalSent++;
          if (sendResult.success) {
            channelStats[channel].successful++;
          } else {
            channelStats[channel].failed++;
          }
        });
      }
    });

    const channelSummary = Object.entries(channelStats).map(([channel, stats]) => ({
      channel: channel as 'sms' | 'email' | 'push',
      totalSent: stats.totalSent,
      successful: stats.successful,
      failed: stats.failed
    }));

    return {
      successfulNotifications,
      failedNotifications,
      successRate,
      channelSummary
    };
  }

  /**
   * Split array into chunks
   * @param array Array to split
   * @param size Chunk size
   * @returns Array of chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
