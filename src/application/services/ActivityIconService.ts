import { ActivityType } from '@/src/domain/entities/shop/backend/backend-dashboard.entity';

/**
 * Service for mapping activity types to appropriate icons
 * Following Clean Architecture principles for utility services
 */
export interface IActivityIconService {
  /**
   * Get the appropriate icon for a given activity type
   * @param type The activity type
   * @returns The corresponding emoji icon
   */
  getActivityIcon(type: ActivityType): string;
}

export class ActivityIconService implements IActivityIconService {
  /**
   * Maps activity types to appropriate emoji icons
   * Icons are chosen to be intuitive and represent the action visually
   */
  getActivityIcon(type: ActivityType): string {
    switch (type) {
      // Queue activities
      case ActivityType.QUEUE_CREATED:
        return "📝";
      case ActivityType.QUEUE_COMPLETED:
        return "✅";
        
      // Customer activities
      case ActivityType.CUSTOMER_REGISTERED:
        return "👥";
        
      // Shop activities
      case ActivityType.SHOP_CREATED:
        return "🏪";
      case ActivityType.SHOP_OPENED:
        return "🔓";
      case ActivityType.SHOP_CLOSED:
        return "🔒";
        
      // Employee activities
      case ActivityType.EMPLOYEE_ADDED:
        return "👤";
      case ActivityType.EMPLOYEE_UPDATED:
        return "✏️";
      case ActivityType.EMPLOYEE_REMOVED:
        return "❌";
      case ActivityType.EMPLOYEE_LOGIN:
        return "🔑";
      case ActivityType.EMPLOYEE_LOGOUT:
        return "🚪";
      case ActivityType.EMPLOYEE_DUTY_START:
        return "⏰";
      case ActivityType.EMPLOYEE_DUTY_END:
        return "🏁";
        
      // Service activities
      case ActivityType.SERVICE_ADDED:
        return "🎯";
      case ActivityType.SERVICE_UPDATED:
        return "🔄";
      case ActivityType.SERVICE_REMOVED:
        return "🗑️";
      case ActivityType.SERVICE_AVAILABILITY_CHANGED:
        return "🔔";
        
      // Payment activities
      case ActivityType.PAYMENT_CREATED:
        return "💳";
      case ActivityType.PAYMENT_COMPLETED:
        return "✅";
      case ActivityType.PAYMENT_FAILED:
        return "❌";
      case ActivityType.PAYMENT_REFUNDED:
        return "💰";
        
      // Promotion activities
      case ActivityType.PROMOTION_CREATED:
        return "🏷️";
      case ActivityType.PROMOTION_UPDATED:
        return "✏️";
      case ActivityType.PROMOTION_ACTIVATED:
        return "✅";
      case ActivityType.PROMOTION_DEACTIVATED:
        return "⏸️";
      case ActivityType.PROMOTION_USED:
        return "🎁";
        
      // Points and rewards activities
      case ActivityType.POINTS_EARNED:
        return "⭐";
      case ActivityType.POINTS_REDEEMED:
        return "🎯";
      case ActivityType.POINTS_EXPIRED:
        return "⏰";
      case ActivityType.REWARD_CLAIMED:
        return "🎁";
      case ActivityType.MEMBERSHIP_UPGRADED:
        return "⬆️";
        
      // Department activities
      case ActivityType.DEPARTMENT_CREATED:
        return "🏢";
      case ActivityType.DEPARTMENT_UPDATED:
        return "✏️";
      case ActivityType.DEPARTMENT_REMOVED:
        return "🗑️";
        
      // System activities
      case ActivityType.SYSTEM_BACKUP:
        return "💾";
      case ActivityType.SYSTEM_MAINTENANCE:
        return "🔧";
      case ActivityType.SYSTEM_ERROR:
        return "⚠️";
      case ActivityType.SYSTEM_ALERT:
        return "📢";
        
      // Settings activities
      case ActivityType.OPENING_HOURS_UPDATED:
        return "🕐";
        
      // Default fallback for any unknown types
      default:
        return "📋";
    }
  }
}
