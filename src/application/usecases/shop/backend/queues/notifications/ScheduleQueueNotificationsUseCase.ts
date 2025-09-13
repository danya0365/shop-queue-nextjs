import { ScheduleQueueNotificationsInput, ScheduleQueueNotificationsResult } from '@/src/application/dtos/shop/backend/queue-notification-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SendQueueNotificationUseCase } from './SendQueueNotificationUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for scheduling automated queue notifications
 * Following SOLID principles and Clean Architecture
 */
export class ScheduleQueueNotificationsUseCase implements IUseCase<ScheduleQueueNotificationsInput, ScheduleQueueNotificationsResult> {
  constructor(
    private readonly sendNotificationUseCase: SendQueueNotificationUseCase,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to schedule queue notifications
   * @param input Schedule notification input
   * @returns Schedule notification result
   */
  async execute(input: ScheduleQueueNotificationsInput): Promise<ScheduleQueueNotificationsResult> {
    try {
      // Validate input
      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }

      if (!input.rules || input.rules.length === 0) {
        throw new Error('Notification rules are required');
      }

      this.logger.info('Starting schedule queue notifications', { 
        shopId: input.shopId,
        rulesCount: input.rules.length
      });

      // Validate and process notification rules
      const processedRules = this.processNotificationRules(input.rules);

      // Schedule notifications based on rules
      const scheduledNotifications = await this.scheduleNotifications(processedRules, input);

      // Store notification schedule
      const scheduleId = await this.storeNotificationSchedule(input.shopId, processedRules, scheduledNotifications);

      const result: ScheduleQueueNotificationsResult = {
        success: true,
        shopId: input.shopId,
        scheduleId,
        rules: processedRules,
        scheduledNotifications,
        summary: {
          totalRules: processedRules.length,
          totalScheduledNotifications: scheduledNotifications.length,
          activeRules: processedRules.filter(r => r.isActive).length,
          estimatedDailyNotifications: this.calculateEstimatedDailyNotifications(processedRules)
        }
      };

      this.logger.info('Schedule queue notifications completed', { 
        result: {
          shopId: result.shopId,
          scheduleId: result.scheduleId,
          totalRules: result.summary.totalRules,
          totalScheduledNotifications: result.summary.totalScheduledNotifications,
          estimatedDailyNotifications: result.summary.estimatedDailyNotifications
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to schedule queue notifications', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to schedule queue notifications',
        'scheduleQueueNotifications',
        { input },
        error
      );
    }
  }

  /**
   * Process and validate notification rules
   * @param rules Raw notification rules
   * @returns Processed rules
   */
  private processNotificationRules(rules: any[]): Array<{
    id: string;
    name: string;
    type: 'time-based' | 'status-based' | 'event-based';
    trigger: {
      time?: string;
      interval?: 'daily' | 'weekly' | 'monthly';
      status?: string;
      event?: string;
      delayMinutes?: number;
    };
    conditions: Array<{
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
      value: string | number;
    }>;
    channels: Array<'sms' | 'email' | 'push'>;
    template: string;
    isActive: boolean;
    priority: 'low' | 'medium' | 'high';
  }> {
    return rules.map((rule, index) => {
      // Validate required fields
      if (!rule.name) {
        throw new Error(`Rule ${index + 1}: Name is required`);
      }

      if (!rule.type) {
        throw new Error(`Rule ${index + 1}: Type is required`);
      }

      if (!rule.trigger) {
        throw new Error(`Rule ${index + 1}: Trigger is required`);
      }

      if (!rule.channels || rule.channels.length === 0) {
        throw new Error(`Rule ${index + 1}: At least one channel is required`);
      }

      // Validate rule type
      const validTypes = ['time-based', 'status-based', 'event-based'];
      if (!validTypes.includes(rule.type)) {
        throw new Error(`Rule ${index + 1}: Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }

      // Validate trigger based on type
      this.validateTrigger(rule.type, rule.trigger, index);

      // Validate channels
      const validChannels = ['sms', 'email', 'push'];
      rule.channels.forEach((channel: string) => {
        if (!validChannels.includes(channel)) {
          throw new Error(`Rule ${index + 1}: Invalid channel '${channel}'. Must be one of: ${validChannels.join(', ')}`);
        }
      });

      return {
        id: rule.id || `rule_${Date.now()}_${index}`,
        name: rule.name,
        type: rule.type,
        trigger: rule.trigger,
        conditions: rule.conditions || [],
        channels: rule.channels,
        template: rule.template || this.getDefaultTemplate(rule.type),
        isActive: rule.isActive !== false,
        priority: rule.priority || 'medium'
      };
    });
  }

  /**
   * Validate trigger based on rule type
   * @param type Rule type
   * @param trigger Trigger configuration
   * @param ruleIndex Rule index for error messaging
   */
  private validateTrigger(type: string, trigger: any, ruleIndex: number): void {
    switch (type) {
      case 'time-based':
        if (!trigger.time || !trigger.interval) {
          throw new Error(`Rule ${ruleIndex + 1}: Time-based rules require 'time' and 'interval' in trigger`);
        }
        break;

      case 'status-based':
        if (!trigger.status) {
          throw new Error(`Rule ${ruleIndex + 1}: Status-based rules require 'status' in trigger`);
        }
        break;

      case 'event-based':
        if (!trigger.event) {
          throw new Error(`Rule ${ruleIndex + 1}: Event-based rules require 'event' in trigger`);
        }
        break;
    }
  }

  /**
   * Get default template for rule type
   * @param type Rule type
   * @returns Default template
   */
  private getDefaultTemplate(type: string): string {
    switch (type) {
      case 'time-based':
        return 'Hi {customerName}, this is a reminder for your queue #{queueNumber} at {shopName}. Your estimated wait time is {estimatedWaitTime} minutes.';
      
      case 'status-based':
        return 'Hi {customerName}, your queue #{queueNumber} status has been updated to: {status}.';
      
      case 'event-based':
        return 'Hi {customerName}, your queue #{queueNumber} is ready! Please proceed to the counter.';
      
      default:
        return 'Hi {customerName}, you have an update regarding your queue #{queueNumber}.';
    }
  }

  /**
   * Schedule notifications based on rules
   * @param rules Processed rules
   * @param input Schedule input
   * @returns Array of scheduled notifications
   */
  private async scheduleNotifications(
    rules: Array<{
      id: string;
      name: string;
      type: string;
      trigger: any;
      conditions: any[];
      channels: string[];
      template: string;
      isActive: boolean;
      priority: 'low' | 'medium' | 'high';
    }>,
    input: ScheduleQueueNotificationsInput
  ): Promise<Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }>> {
    const scheduledNotifications: Array<{
      ruleId: string;
      ruleName: string;
      scheduledTime: string;
      channels: Array<'sms' | 'email' | 'push'>;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    for (const rule of rules) {
      if (!rule.isActive) {
        continue;
      }

      const ruleSchedules = this.calculateScheduleForRule(rule, input);
      scheduledNotifications.push(...ruleSchedules);
    }

    return scheduledNotifications;
  }

  /**
   * Calculate schedule for a specific rule
   * @param rule Rule to schedule
   * @param input Schedule input
   * @returns Array of scheduled times for the rule
   */
  private calculateScheduleForRule(
    rule: {
      id: string;
      name: string;
      type: string;
      trigger: any;
      channels: string[];
      priority: 'low' | 'medium' | 'high';
    },
    input: ScheduleQueueNotificationsInput
  ): Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }> {
    const schedules: Array<{
      ruleId: string;
      ruleName: string;
      scheduledTime: string;
      channels: Array<'sms' | 'email' | 'push'>;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    switch (rule.type) {
      case 'time-based':
        const timeSchedules = this.calculateTimeBasedSchedule(rule, input);
        schedules.push(...timeSchedules);
        break;

      case 'status-based':
        const statusSchedules = this.calculateStatusBasedSchedule(rule, input);
        schedules.push(...statusSchedules);
        break;

      case 'event-based':
        const eventSchedules = this.calculateEventBasedSchedule(rule, input);
        schedules.push(...eventSchedules);
        break;
    }

    return schedules;
  }

  /**
   * Calculate time-based schedule
   * @param rule Time-based rule
   * @param input Schedule input
   * @returns Array of scheduled times
   */
  private calculateTimeBasedSchedule(
    rule: {
      id: string;
      name: string;
      trigger: any;
      channels: string[];
      priority: 'low' | 'medium' | 'high';
    },
    input: ScheduleQueueNotificationsInput
  ): Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }> {
    const schedules: Array<{
      ruleId: string;
      ruleName: string;
      scheduledTime: string;
      channels: Array<'sms' | 'email' | 'push'>;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    const now = new Date();
    const scheduleDays = input.scheduleDays || 7; // Default to 7 days

    for (let day = 0; day < scheduleDays; day++) {
      const scheduleDate = new Date(now);
      scheduleDate.setDate(now.getDate() + day);

      // Parse trigger time
      const [hours, minutes] = rule.trigger.time.split(':').map(Number);
      scheduleDate.setHours(hours, minutes, 0, 0);

      // Don't schedule past times for today
      if (day === 0 && scheduleDate <= now) {
        continue;
      }

      schedules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        scheduledTime: scheduleDate.toISOString(),
        channels: rule.channels as Array<'sms' | 'email' | 'push'>,
        priority: rule.priority
      });
    }

    return schedules;
  }

  /**
   * Calculate status-based schedule
   * @param rule Status-based rule
   * @param input Schedule input
   * @returns Array of scheduled times
   */
  private calculateStatusBasedSchedule(
    rule: {
      id: string;
      name: string;
      trigger: any;
      channels: string[];
      priority: 'low' | 'medium' | 'high';
    },
    input: ScheduleQueueNotificationsInput
  ): Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }> {
    // Status-based notifications are triggered by queue status changes
    // They don't have specific scheduled times, but we create a placeholder
    return [{
      ruleId: rule.id,
      ruleName: rule.name,
      scheduledTime: new Date().toISOString(), // Will be triggered by status change
      channels: rule.channels as Array<'sms' | 'email' | 'push'>,
      priority: rule.priority
    }];
  }

  /**
   * Calculate event-based schedule
   * @param rule Event-based rule
   * @param input Schedule input
   * @returns Array of scheduled times
   */
  private calculateEventBasedSchedule(
    rule: {
      id: string;
      name: string;
      trigger: any;
      channels: string[];
      priority: 'low' | 'medium' | 'high';
    },
    input: ScheduleQueueNotificationsInput
  ): Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }> {
    // Event-based notifications are triggered by specific events
    // They don't have specific scheduled times, but we create a placeholder
    return [{
      ruleId: rule.id,
      ruleName: rule.name,
      scheduledTime: new Date().toISOString(), // Will be triggered by event
      channels: rule.channels as Array<'sms' | 'email' | 'push'>,
      priority: rule.priority
    }];
  }

  /**
   * Store notification schedule
   * @param shopId Shop ID
   * @param rules Processed rules
   * @param scheduledNotifications Scheduled notifications
   * @returns Schedule ID
   */
  private async storeNotificationSchedule(
    shopId: string,
    rules: Array<{
      id: string;
      name: string;
      type: string;
      trigger: any;
      conditions: any[];
      channels: string[];
      template: string;
      isActive: boolean;
      priority: 'low' | 'medium' | 'high';
    }>,
    scheduledNotifications: Array<{
      ruleId: string;
      ruleName: string;
      scheduledTime: string;
      channels: string[];
      priority: 'low' | 'medium' | 'high';
    }>
  ): Promise<string> {
    // In a real implementation, this would store the schedule in a database
    // For now, we'll generate a schedule ID and simulate storage
    const scheduleId = `schedule_${shopId}_${Date.now()}`;

    this.logger.info('Storing notification schedule', {
      scheduleId,
      shopId,
      rulesCount: rules.length,
      scheduledNotificationsCount: scheduledNotifications.length
    });

    // Simulate database storage
    await new Promise(resolve => setTimeout(resolve, 100));

    return scheduleId;
  }

  /**
   * Calculate estimated daily notifications
   * @param rules Processed rules
   * @returns Estimated daily notifications
   */
  private calculateEstimatedDailyNotifications(rules: Array<{
    type: string;
    trigger: any;
    isActive: boolean;
  }>): number {
    let estimatedCount = 0;

    rules.forEach(rule => {
      if (!rule.isActive) {
        return;
      }

      switch (rule.type) {
        case 'time-based':
          // Time-based rules trigger at specific times
          estimatedCount += 1; // Assume 1 notification per day per rule
          break;

        case 'status-based':
          // Status-based rules trigger when queue status changes
          estimatedCount += 5; // Assume 5 status changes per day per rule
          break;

        case 'event-based':
          // Event-based rules trigger on specific events
          estimatedCount += 3; // Assume 3 events per day per rule
          break;
      }
    });

    return estimatedCount;
  }
}
