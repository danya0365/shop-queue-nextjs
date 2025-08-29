import type { Logger } from '@/src/domain/interfaces/logger';

// Notification Settings interface and types
export interface NotificationSettings {
  id: string;
  shopId: string;

  // SMS Settings
  smsEnabled: boolean;
  smsProvider: 'twilio' | 'aws_sns' | 'local_provider' | null;
  smsApiKey?: string;
  smsApiSecret?: string;
  smsSenderName?: string;
  smsTemplateBookingConfirm?: string;
  smsTemplateBookingReminder?: string;
  smsTemplateBookingCancelled?: string;

  // Email Settings
  emailEnabled: boolean;
  emailProvider: 'smtp' | 'sendgrid' | 'aws_ses' | null;
  emailHost?: string;
  emailPort?: number;
  emailUsername?: string;
  emailPassword?: string;
  emailFromAddress?: string;
  emailFromName?: string;
  emailTemplateBookingConfirm?: string;
  emailTemplateBookingReminder?: string;
  emailTemplateBookingCancelled?: string;

  // LINE Notify Settings
  lineNotifyEnabled: boolean;
  lineNotifyToken?: string;
  lineNotifyTemplateBookingConfirm?: string;
  lineNotifyTemplateBookingReminder?: string;
  lineNotifyTemplateBookingCancelled?: string;

  // Push Notification Settings
  pushNotificationEnabled: boolean;
  firebaseServerKey?: string;
  pushTemplateBookingConfirm?: string;
  pushTemplateBookingReminder?: string;
  pushTemplateBookingCancelled?: string;

  // Timing Settings
  reminderMinutesBefore: number;
  maxRetryAttempts: number;
  retryIntervalMinutes: number;

  // Advanced Settings
  enableDeliveryReceipts: boolean;
  enableClickTracking: boolean;
  enableUnsubscribe: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  type: 'sms' | 'email' | 'line' | 'push';
  event: 'booking_confirm' | 'booking_reminder' | 'booking_cancelled' | 'queue_ready' | 'promotion';
  name: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  sentByType: Record<string, number>;
  sentByEvent: Record<string, number>;
  recentNotifications: Array<{
    id: string;
    type: string;
    event: string;
    recipient: string;
    status: 'sent' | 'delivered' | 'failed';
    sentAt: Date;
  }>;
  monthlyTrends: Array<{
    month: string;
    sent: number;
    delivered: number;
    failed: number;
  }>;
}

export interface INotificationSettingsBackendService {
  getNotificationSettings(shopId: string): Promise<NotificationSettings | null>;
  updateNotificationSettings(shopId: string, data: Partial<NotificationSettings>): Promise<NotificationSettings>;
  getNotificationTemplates(shopId: string): Promise<NotificationTemplate[]>;
  updateNotificationTemplate(shopId: string, templateId: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate>;
  testNotificationSettings(shopId: string, type: 'sms' | 'email' | 'line' | 'push', recipient: string): Promise<{ success: boolean; message: string }>;
  getNotificationStats(shopId: string): Promise<NotificationStats>;
  validateSettings(settings: Partial<NotificationSettings>): Promise<{ isValid: boolean; errors: string[] }>;
  resetToDefaults(shopId: string): Promise<NotificationSettings>;
}

export class NotificationSettingsBackendService implements INotificationSettingsBackendService {
  private mockSettings: NotificationSettings = {
    id: 'notification_settings_1',
    shopId: 'shop1',

    // SMS Settings
    smsEnabled: true,
    smsProvider: 'local_provider',
    smsApiKey: 'test_api_key_***',
    smsApiSecret: 'test_api_secret_***',
    smsSenderName: 'ModernHair',
    smsTemplateBookingConfirm: 'สวัสดีค่ะ {{customerName}} การจองของคุณได้รับการยืนยันแล้ว วันที่ {{bookingDate}} เวลา {{bookingTime}} บริการ {{serviceName}} ขอบคุณค่ะ',
    smsTemplateBookingReminder: 'แจ้งเตือนค่ะ {{customerName}} คุณมีนัดหมาย {{serviceName}} ในอีก {{minutesLeft}} นาที ที่ร้าน {{shopName}}',
    smsTemplateBookingCancelled: 'เรียน {{customerName}} การจองของคุณได้ถูกยกเลิกแล้ว วันที่ {{bookingDate}} เวลา {{bookingTime}} หากมีข้อสงสัยโทร {{shopPhone}}',

    // Email Settings
    emailEnabled: true,
    emailProvider: 'smtp',
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailUsername: 'noreply@modernhair.com',
    emailPassword: 'email_password_***',
    emailFromAddress: 'noreply@modernhair.com',
    emailFromName: 'ร้านตัดผมสไตล์โมเดิร์น',
    emailTemplateBookingConfirm: 'การจองของคุณได้รับการยืนยันแล้ว',
    emailTemplateBookingReminder: 'แจ้งเตือนการนัดหมาย',
    emailTemplateBookingCancelled: 'การจองถูกยกเลิก',

    // LINE Notify Settings
    lineNotifyEnabled: false,
    lineNotifyToken: undefined,
    lineNotifyTemplateBookingConfirm: '✅ การจองยืนยันแล้ว\n{{customerName}}\n📅 {{bookingDate}}\n🕐 {{bookingTime}}\n💇 {{serviceName}}',
    lineNotifyTemplateBookingReminder: '⏰ แจ้งเตือนนัดหมาย\nคุณ {{customerName}} มีนัดในอีก {{minutesLeft}} นาที',
    lineNotifyTemplateBookingCancelled: '❌ การจองถูกยกเลิก\n{{customerName}}\n📅 {{bookingDate}}\n🕐 {{bookingTime}}',

    // Push Notification Settings
    pushNotificationEnabled: false,
    firebaseServerKey: undefined,
    pushTemplateBookingConfirm: 'การจองของคุณได้รับการยืนยันแล้ว',
    pushTemplateBookingReminder: 'คุณมีนัดหมายในอีก {{minutesLeft}} นาที',
    pushTemplateBookingCancelled: 'การจองของคุณถูกยกเลิก',

    // Timing Settings
    reminderMinutesBefore: 30,
    maxRetryAttempts: 3,
    retryIntervalMinutes: 5,

    // Advanced Settings
    enableDeliveryReceipts: true,
    enableClickTracking: false,
    enableUnsubscribe: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',

    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  };

  private mockTemplates: NotificationTemplate[] = [
    {
      id: 'template_1',
      type: 'sms',
      event: 'booking_confirm',
      name: 'SMS ยืนยันการจอง',
      content: 'สวัสดีค่ะ {{customerName}} การจองของคุณได้รับการยืนยันแล้ว วันที่ {{bookingDate}} เวลา {{bookingTime}} บริการ {{serviceName}}',
      variables: ['customerName', 'bookingDate', 'bookingTime', 'serviceName', 'shopName', 'shopPhone'],
      isActive: true,
    },
    {
      id: 'template_2',
      type: 'email',
      event: 'booking_confirm',
      name: 'อีเมลยืนยันการจอง',
      subject: 'ยืนยันการจอง - {{shopName}}',
      content: 'เรียน {{customerName}}\n\nการจองของคุณได้รับการยืนยันแล้ว\n\nรายละเอียด:\n- วันที่: {{bookingDate}}\n- เวลา: {{bookingTime}}\n- บริการ: {{serviceName}}\n- ราคา: {{servicePrice}} บาท\n\nขอบคุณที่ใช้บริการ\n{{shopName}}',
      variables: ['customerName', 'bookingDate', 'bookingTime', 'serviceName', 'servicePrice', 'shopName'],
      isActive: true,
    },
    {
      id: 'template_3',
      type: 'sms',
      event: 'booking_reminder',
      name: 'SMS แจ้งเตือนนัดหมาย',
      content: 'แจ้งเตือนค่ะ {{customerName}} คุณมีนัดหมาย {{serviceName}} ในอีก {{minutesLeft}} นาที ที่ร้าน {{shopName}}',
      variables: ['customerName', 'serviceName', 'minutesLeft', 'shopName', 'shopAddress'],
      isActive: true,
    },
  ];

  private mockStats: NotificationStats = {
    totalSent: 1250,
    totalDelivered: 1180,
    totalFailed: 70,
    deliveryRate: 94.4,
    sentByType: {
      sms: 800,
      email: 350,
      line: 100,
      push: 0,
    },
    sentByEvent: {
      booking_confirm: 500,
      booking_reminder: 450,
      booking_cancelled: 150,
      queue_ready: 100,
      promotion: 50,
    },
    recentNotifications: [
      {
        id: 'notif_1',
        type: 'sms',
        event: 'booking_confirm',
        recipient: '081-234-5678',
        status: 'delivered',
        sentAt: new Date('2024-01-15T14:30:00Z'),
      },
      {
        id: 'notif_2',
        type: 'email',
        event: 'booking_reminder',
        recipient: 'customer@email.com',
        status: 'delivered',
        sentAt: new Date('2024-01-15T13:45:00Z'),
      },
      {
        id: 'notif_3',
        type: 'sms',
        event: 'booking_cancelled',
        recipient: '082-345-6789',
        status: 'failed',
        sentAt: new Date('2024-01-15T12:15:00Z'),
      },
    ],
    monthlyTrends: [
      { month: '2024-01', sent: 1250, delivered: 1180, failed: 70 },
      { month: '2023-12', sent: 1100, delivered: 1045, failed: 55 },
      { month: '2023-11', sent: 950, delivered: 912, failed: 38 },
    ],
  };

  constructor(private readonly logger: Logger) { }

  async getNotificationSettings(shopId: string): Promise<NotificationSettings | null> {
    this.logger.info('NotificationSettingsBackendService: Getting notification settings', { shopId });

    if (this.mockSettings.shopId !== shopId) {
      this.logger.warn('NotificationSettingsBackendService: Settings not found', { shopId });
      return null;
    }

    this.logger.info('NotificationSettingsBackendService: Retrieved notification settings', { shopId });
    return this.mockSettings;
  }

  async updateNotificationSettings(shopId: string, data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    this.logger.info('NotificationSettingsBackendService: Updating notification settings', { shopId, data });

    if (this.mockSettings.shopId !== shopId) {
      this.logger.error('NotificationSettingsBackendService: Shop not found', { shopId });
      throw new Error('Shop not found');
    }

    // Update settings
    this.mockSettings = {
      ...this.mockSettings,
      ...data,
      updatedAt: new Date(),
    };

    this.logger.info('NotificationSettingsBackendService: Settings updated', {
      shopId,
      updatedFields: Object.keys(data)
    });

    return this.mockSettings;
  }

  async getNotificationTemplates(shopId: string): Promise<NotificationTemplate[]> {
    this.logger.info('NotificationSettingsBackendService: Getting notification templates', { shopId });

    this.logger.info('NotificationSettingsBackendService: Retrieved templates', {
      shopId,
      count: this.mockTemplates.length
    });

    return this.mockTemplates;
  }

  async updateNotificationTemplate(shopId: string, templateId: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    this.logger.info('NotificationSettingsBackendService: Updating template', { shopId, templateId, data });

    const templateIndex = this.mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      this.logger.error('NotificationSettingsBackendService: Template not found', { templateId });
      throw new Error('Template not found');
    }

    this.mockTemplates[templateIndex] = {
      ...this.mockTemplates[templateIndex],
      ...data,
    };

    this.logger.info('NotificationSettingsBackendService: Template updated', { templateId });
    return this.mockTemplates[templateIndex];
  }

  async testNotificationSettings(shopId: string, type: 'sms' | 'email' | 'line' | 'push', recipient: string): Promise<{ success: boolean; message: string }> {
    this.logger.info('NotificationSettingsBackendService: Testing notification settings', { shopId, type, recipient });

    // Simulate test based on type
    const results = {
      sms: Math.random() > 0.1, // 90% success rate
      email: Math.random() > 0.05, // 95% success rate
      line: Math.random() > 0.2, // 80% success rate
      push: Math.random() > 0.15, // 85% success rate
    };

    const success = results[type];
    const message = success
      ? `ทดสอบส่ง ${type.toUpperCase()} สำเร็จ ไปยัง ${recipient}`
      : `ทดสอบส่ง ${type.toUpperCase()} ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า`;

    this.logger.info('NotificationSettingsBackendService: Test completed', {
      shopId,
      type,
      recipient,
      success
    });

    return { success, message };
  }

  async getNotificationStats(shopId: string): Promise<NotificationStats> {
    this.logger.info('NotificationSettingsBackendService: Getting notification stats', { shopId });

    this.logger.info('NotificationSettingsBackendService: Retrieved stats', {
      shopId,
      totalSent: this.mockStats.totalSent,
      deliveryRate: this.mockStats.deliveryRate
    });

    return this.mockStats;
  }

  async validateSettings(settings: Partial<NotificationSettings>): Promise<{ isValid: boolean; errors: string[] }> {
    this.logger.info('NotificationSettingsBackendService: Validating settings', { settings });

    const errors: string[] = [];

    // Validate SMS settings
    if (settings.smsEnabled && !settings.smsApiKey) {
      errors.push('SMS API Key จำเป็นต้องระบุเมื่อเปิดใช้งาน SMS');
    }

    // Validate Email settings
    if (settings.emailEnabled) {
      if (!settings.emailFromAddress) {
        errors.push('Email ผู้ส่งจำเป็นต้องระบุเมื่อเปิดใช้งาน Email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.emailFromAddress)) {
        errors.push('รูปแบบ Email ผู้ส่งไม่ถูกต้อง');
      }

      if (settings.emailPort && (settings.emailPort < 1 || settings.emailPort > 65535)) {
        errors.push('Port ของ Email ต้องอยู่ระหว่าง 1-65535');
      }
    }

    // Validate LINE Notify settings
    if (settings.lineNotifyEnabled && !settings.lineNotifyToken) {
      errors.push('LINE Notify Token จำเป็นต้องระบุเมื่อเปิดใช้งาน LINE Notify');
    }

    // Validate timing settings
    if (settings.reminderMinutesBefore !== undefined && settings.reminderMinutesBefore < 0) {
      errors.push('เวลาแจ้งเตือนล่วงหน้าต้องไม่น้อยกว่า 0 นาที');
    }

    if (settings.maxRetryAttempts !== undefined && settings.maxRetryAttempts < 0) {
      errors.push('จำนวนครั้งในการลองส่งใหม่ต้องไม่น้อยกว่า 0');
    }

    // Validate quiet hours
    if (settings.quietHoursStart && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.quietHoursStart)) {
      errors.push('รูปแบบเวลาเริ่มต้น Quiet Hours ไม่ถูกต้อง');
    }

    if (settings.quietHoursEnd && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.quietHoursEnd)) {
      errors.push('รูปแบบเวลาสิ้นสุด Quiet Hours ไม่ถูกต้อง');
    }

    const isValid = errors.length === 0;

    this.logger.info('NotificationSettingsBackendService: Validation completed', {
      isValid,
      errorCount: errors.length
    });

    return { isValid, errors };
  }

  async resetToDefaults(shopId: string): Promise<NotificationSettings> {
    this.logger.info('NotificationSettingsBackendService: Resetting to defaults', { shopId });

    const defaultSettings: NotificationSettings = {
      id: this.mockSettings.id,
      shopId,

      // SMS Settings - Disabled by default
      smsEnabled: false,
      smsProvider: null,
      smsApiKey: undefined,
      smsApiSecret: undefined,
      smsSenderName: undefined,
      smsTemplateBookingConfirm: 'การจองของคุณได้รับการยืนยันแล้ว {{customerName}}',
      smsTemplateBookingReminder: 'แจ้งเตือน: คุณมีนัดหมายในอีก {{minutesLeft}} นาที',
      smsTemplateBookingCancelled: 'การจองของคุณถูกยกเลิก {{customerName}}',

      // Email Settings - Disabled by default
      emailEnabled: false,
      emailProvider: null,
      emailHost: undefined,
      emailPort: undefined,
      emailUsername: undefined,
      emailPassword: undefined,
      emailFromAddress: undefined,
      emailFromName: undefined,
      emailTemplateBookingConfirm: 'การจองได้รับการยืนยัน',
      emailTemplateBookingReminder: 'แจ้งเตือนการนัดหมาย',
      emailTemplateBookingCancelled: 'การจองถูกยกเลิก',

      // LINE Notify Settings - Disabled by default
      lineNotifyEnabled: false,
      lineNotifyToken: undefined,
      lineNotifyTemplateBookingConfirm: '✅ การจองยืนยันแล้ว',
      lineNotifyTemplateBookingReminder: '⏰ แจ้งเตือนนัดหมาย',
      lineNotifyTemplateBookingCancelled: '❌ การจองถูกยกเลิก',

      // Push Notification Settings - Disabled by default
      pushNotificationEnabled: false,
      firebaseServerKey: undefined,
      pushTemplateBookingConfirm: 'การจองยืนยันแล้ว',
      pushTemplateBookingReminder: 'แจ้งเตือนนัดหมาย',
      pushTemplateBookingCancelled: 'การจองถูกยกเลิก',

      // Timing Settings - Conservative defaults
      reminderMinutesBefore: 15,
      maxRetryAttempts: 1,
      retryIntervalMinutes: 5,

      // Advanced Settings - Basic defaults
      enableDeliveryReceipts: false,
      enableClickTracking: false,
      enableUnsubscribe: true,
      quietHoursStart: undefined,
      quietHoursEnd: undefined,

      createdAt: this.mockSettings.createdAt,
      updatedAt: new Date(),
    };

    this.mockSettings = defaultSettings;

    this.logger.info('NotificationSettingsBackendService: Reset to defaults completed', { shopId });
    return this.mockSettings;
  }
}
