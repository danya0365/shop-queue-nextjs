/**
 * DTOs for queue notification features
 * Following Clean Architecture principles
 */

export interface SendQueueNotificationInput {
  queueId: string;
  type: 'reminder' | 'status-update' | 'ready-to-serve' | 'delay-notification' | 'feedback';
  channels: Array<'sms' | 'email' | 'push'>;
  customMessage?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface SendQueueNotificationResult {
  success: boolean;
  queueId: string;
  customerId: string;
  type: string;
  channels: Array<'sms' | 'email' | 'push'>;
  sendResults: Array<{
    channel: 'sms' | 'email' | 'push';
    success: boolean;
    error?: string;
    messageId?: string;
  }>;
  message: string;
  summary: {
    totalChannels: number;
    successfulChannels: number;
    failedChannels: number;
  };
}

export interface SendBulkQueueNotificationsInput {
  queueIds: string[];
  type: 'reminder' | 'status-update' | 'ready-to-serve' | 'delay-notification' | 'feedback';
  channels: Array<'sms' | 'email' | 'push'>;
  customMessage?: string;
  priority?: 'low' | 'medium' | 'high';
  batchSize?: number;
}

export interface SendBulkQueueNotificationsResult {
  success: boolean;
  totalQueues: number;
  type: string;
  channels: Array<'sms' | 'email' | 'push'>;
  results: Array<{
    queueId: string;
    success: boolean;
    error?: string;
    sendResults?: Array<{
      channel: 'sms' | 'email' | 'push';
      success: boolean;
      error?: string;
      messageId?: string;
    }>;
  }>;
  summary: {
    successfulNotifications: number;
    failedNotifications: number;
    successRate: number;
    channelSummary: Array<{
      channel: 'sms' | 'email' | 'push';
      totalSent: number;
      successful: number;
      failed: number;
    }>;
  };
}

export interface ScheduleQueueNotificationsInput {
  shopId: string;
  rules: Array<{
    id?: string;
    name: string;
    type: 'time-based' | 'status-based' | 'event-based';
    trigger: {
      time?: string; // For time-based: "HH:mm"
      interval?: 'daily' | 'weekly' | 'monthly'; // For time-based
      status?: string; // For status-based: "waiting", "in_progress", etc.
      event?: string; // For event-based: "queue_created", "status_changed", etc.
      delayMinutes?: number; // Delay after trigger
    };
    conditions?: Array<{
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
      value: string | number;
    }>;
    channels: Array<'sms' | 'email' | 'push'>;
    template?: string;
    isActive?: boolean;
    priority?: 'low' | 'medium' | 'high';
  }>;
  scheduleDays?: number; // Number of days to schedule ahead
  timezone?: string;
}

export interface ScheduleQueueNotificationsResult {
  success: boolean;
  shopId: string;
  scheduleId: string;
  rules: Array<{
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
  }>;
  scheduledNotifications: Array<{
    ruleId: string;
    ruleName: string;
    scheduledTime: string;
    channels: Array<'sms' | 'email' | 'push'>;
    priority: 'low' | 'medium' | 'high';
  }>;
  summary: {
    totalRules: number;
    totalScheduledNotifications: number;
    activeRules: number;
    estimatedDailyNotifications: number;
  };
}
