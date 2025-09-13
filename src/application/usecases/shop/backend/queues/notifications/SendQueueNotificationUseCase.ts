import { SendQueueNotificationInput, SendQueueNotificationResult } from '@/src/application/dtos/shop/backend/queue-notification-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendCustomerRepository } from '@/src/domain/repositories/shop/backend/backend-customer-repository';

/**
 * Use case for sending queue notifications to customers
 * Following SOLID principles and Clean Architecture
 */
export class SendQueueNotificationUseCase implements IUseCase<SendQueueNotificationInput, SendQueueNotificationResult> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly customerRepository: ShopBackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to send queue notification
   * @param input Notification input
   * @returns Notification result
   */
  async execute(input: SendQueueNotificationInput): Promise<SendQueueNotificationResult> {
    try {
      // Validate input
      if (!input.queueId) {
        throw new Error('Queue ID is required');
      }

      if (!input.type) {
        throw new Error('Notification type is required');
      }

      this.logger.info('Starting send queue notification', { 
        queueId: input.queueId,
        type: input.type,
        channels: input.channels || ['sms']
      });

      // Get queue details
      const queue = await this.queueRepository.getQueueById(input.queueId);
      if (!queue) {
        throw new Error('Queue not found');
      }

      // Get customer details
      const customer = await this.customerRepository.getCustomerById(queue.customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Validate notification can be sent
      this.validateNotificationForQueue(queue, input.type);

      // Prepare notification content
      const notificationContent = this.prepareNotificationContent(queue, customer, input.type);

      // Send notification through specified channels
      const sendResults = await this.sendNotificationThroughChannels(
        customer,
        notificationContent,
        input.channels || ['sms']
      );

      // Record notification in queue
      await this.recordNotificationInQueue(queue.id, input.type, sendResults);

      const result: SendQueueNotificationResult = {
        success: sendResults.some(r => r.success),
        queueId: input.queueId,
        customerId: customer.id,
        type: input.type,
        channels: input.channels || ['sms'],
        sendResults,
        message: notificationContent.message,
        summary: {
          totalChannels: sendResults.length,
          successfulChannels: sendResults.filter(r => r.success).length,
          failedChannels: sendResults.filter(r => !r.success).length
        }
      };

      this.logger.info('Send queue notification completed', { 
        result: {
          queueId: result.queueId,
          type: result.type,
          success: result.success,
          successfulChannels: result.summary.successfulChannels,
          failedChannels: result.summary.failedChannels
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to send queue notification', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to send queue notification',
        'sendQueueNotification',
        { input },
        error
      );
    }
  }

  /**
   * Validate that notification can be sent for queue
   * @param queue Queue to validate
   * @param type Notification type
   */
  private validateNotificationForQueue(queue: any, type: string): void {
    // Check if queue is completed
    if (queue.status === 'completed' && type !== 'feedback') {
      throw new Error('Cannot send notifications for completed queues (except feedback)');
    }

    // Check if queue is cancelled
    if (queue.status === 'cancelled') {
      throw new Error('Cannot send notifications for cancelled queues');
    }

    // Check if queue is no-show
    if (queue.status === 'no-show' && type !== 'reminder') {
      throw new Error('Cannot send notifications for no-show queues (except reminder)');
    }

    // Validate notification type
    const validTypes = ['reminder', 'status-update', 'ready-to-serve', 'delay-notification', 'feedback'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }
  }

  /**
   * Prepare notification content
   * @param queue Queue data
   * @param customer Customer data
   * @param type Notification type
   * @returns Notification content
   */
  private prepareNotificationContent(queue: any, customer: any, type: string): {
    message: string;
    subject?: string;
    data: any;
  } {
    const customerName = customer.name || 'Customer';
    const queueNumber = queue.queueNumber || queue.id.slice(-6);
    const shopName = queue.shop?.name || 'Shop';

    switch (type) {
      case 'reminder':
        return {
          message: `Hi ${customerName}, this is a reminder for your queue #${queueNumber} at ${shopName}. Your estimated wait time is ${queue.estimatedWaitTime || 15} minutes.`,
          subject: `Queue Reminder - ${shopName}`,
          data: {
            queueNumber,
            estimatedWaitTime: queue.estimatedWaitTime || 15,
            shopName,
            customerName
          }
        };

      case 'status-update':
        const statusText = this.getStatusText(queue.status);
        return {
          message: `Hi ${customerName}, your queue #${queueNumber} status has been updated to: ${statusText}.`,
          subject: `Queue Status Update - ${shopName}`,
          data: {
            queueNumber,
            status: queue.status,
            statusText,
            shopName,
            customerName
          }
        };

      case 'ready-to-serve':
        return {
          message: `Hi ${customerName}, your queue #${queueNumber} is ready! Please proceed to the counter.`,
          subject: `Queue Ready - ${shopName}`,
          data: {
            queueNumber,
            shopName,
            customerName,
            urgent: true
          }
        };

      case 'delay-notification':
        const delayTime = queue.actualWaitTime - queue.estimatedWaitTime;
        return {
          message: `Hi ${customerName}, there's a delay with your queue #${queueNumber}. New estimated wait time: ${queue.actualWaitTime || 30} minutes.`,
          subject: `Queue Delay - ${shopName}`,
          data: {
            queueNumber,
            originalWaitTime: queue.estimatedWaitTime || 15,
            newWaitTime: queue.actualWaitTime || 30,
            delayTime,
            shopName,
            customerName
          }
        };

      case 'feedback':
        return {
          message: `Hi ${customerName}, thank you for visiting ${shopName}! We'd appreciate your feedback about your experience.`,
          subject: `Feedback Request - ${shopName}`,
          data: {
            queueNumber,
            shopName,
            customerName,
            feedbackLink: this.generateFeedbackLink(queue.id)
          }
        };

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }

  /**
   * Get status text for display
   * @param status Queue status
   * @returns Status text
   */
  private getStatusText(status: string): string {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  }

  /**
   * Generate feedback link
   * @param queueId Queue ID
   * @returns Feedback link
   */
  private generateFeedbackLink(queueId: string): string {
    // In a real implementation, this would generate a proper feedback link
    return `https://shop-queue.com/feedback/${queueId}`;
  }

  /**
   * Send notification through specified channels
   * @param customer Customer data
   * @param content Notification content
   * @param channels Channels to send through
   * @returns Send results
   */
  private async sendNotificationThroughChannels(
    customer: any,
    content: {
      message: string;
      subject?: string;
      data: any;
    },
    channels: ('sms' | 'email' | 'push')[]
  ): Promise<Array<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }>> {
    const results: Array<{
      channel: 'sms' | 'email' | 'push';
      success: boolean;
      error?: string;
      messageId?: string;
    }> = [];

    for (const channel of channels) {
      try {
        const result = await this.sendThroughChannel(customer, content, channel);
        results.push(result);
      } catch (error) {
        this.logger.error('Failed to send notification through channel', { 
          channel, 
          error, 
          customerId: customer.id 
        });
        
        results.push({
          channel,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Send notification through specific channel
   * @param customer Customer data
   * @param content Notification content
   * @param channel Channel to send through
   * @returns Send result
   */
  private async sendThroughChannel(
    customer: any,
    content: {
      message: string;
      subject?: string;
      data: any;
    },
    channel: 'sms' | 'email' | 'push'
  ): Promise<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }> {
    switch (channel) {
      case 'sms':
        return await this.sendSMS(customer, content);
      case 'email':
        return await this.sendEmail(customer, content);
      case 'push':
        return await this.sendPushNotification(customer, content);
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  /**
   * Send SMS notification
   * @param customer Customer data
   * @param content Notification content
   * @returns Send result
   */
  private async sendSMS(
    customer: any,
    content: {
      message: string;
      data: any;
    }
  ): Promise<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }> {
    if (!customer.phone) {
      throw new Error('Customer phone number not available');
    }

    // In a real implementation, this would integrate with an SMS service
    // For now, we'll simulate the SMS sending
    this.logger.info('Sending SMS', {
      to: customer.phone,
      message: content.message
    });

    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      channel: 'sms',
      success: true,
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Send email notification
   * @param customer Customer data
   * @param content Notification content
   * @returns Send result
   */
  private async sendEmail(
    customer: any,
    content: {
      message: string;
      subject?: string;
      data: any;
    }
  ): Promise<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }> {
    if (!customer.email) {
      throw new Error('Customer email not available');
    }

    if (!content.subject) {
      throw new Error('Email subject is required');
    }

    // In a real implementation, this would integrate with an email service
    // For now, we'll simulate the email sending
    this.logger.info('Sending email', {
      to: customer.email,
      subject: content.subject,
      message: content.message
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      channel: 'email',
      success: true,
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Send push notification
   * @param customer Customer data
   * @param content Notification content
   * @returns Send result
   */
  private async sendPushNotification(
    customer: any,
    content: {
      message: string;
      data: any;
    }
  ): Promise<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }> {
    if (!customer.pushToken) {
      throw new Error('Customer push token not available');
    }

    // In a real implementation, this would integrate with a push notification service
    // For now, we'll simulate the push notification sending
    this.logger.info('Sending push notification', {
      to: customer.pushToken,
      message: content.message,
      data: content.data
    });

    // Simulate push notification sending
    await new Promise(resolve => setTimeout(resolve, 150));

    return {
      channel: 'push',
      success: true,
      messageId: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Record notification in queue
   * @param queueId Queue ID
   * @param type Notification type
   * @param sendResults Send results
   */
  private async recordNotificationInQueue(
    queueId: string,
    type: string,
    sendResults: Array<{
      channel: 'sms' | 'email' | 'push';
      success: boolean;
      error?: string;
      messageId?: string;
    }>
  ): Promise<void> {
    try {
      // Log notification results (in a real implementation, this would store notifications in a separate table)
      this.logger.info('Notification results recorded', {
        queueId,
        type,
        results: sendResults
      });
      
      // Note: In a production system, notifications should be stored in a separate notifications table
      // For now, we just log the results since the queue entity doesn't support notifications
    } catch (error) {
      this.logger.error('Failed to record notification in queue', { 
        queueId, 
        type, 
        error 
      });
      // Don't throw error here as notification was already sent
    }
  }
}
