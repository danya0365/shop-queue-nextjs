import type { Logger } from '@/src/domain/interfaces/logger';
import { ProfileRoleDto } from '../dtos/profile-dto';
import type {
  ShopTierDto,
  SubscriptionLimits,
  SubscriptionTier,
  SubscriptionUpgradeDto,
  UsageStatsDto,
  UserSubscriptionDto
} from '../dtos/subscription-dto';
import type { ISubscriptionService } from '../interfaces/subscription-service.interface';

/**
 * SubscriptionService handles subscription and pricing logic
 * Following SOLID principles and Clean Architecture
 */
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly logger: Logger
  ) { }

  /**
   * Get subscription tier based on profile role
   */
  getTierByRole(role: ProfileRoleDto): SubscriptionTier {
    const roleToTierMap: Record<ProfileRoleDto, SubscriptionTier> = {
      'user': 'free',
      'moderator': 'pro',
      'admin': 'enterprise'
    };

    return roleToTierMap[role] || 'free';
  }

  /**
   * Get subscription limits for a tier
   */
  async getLimitsByTier(tier: SubscriptionTier): Promise<SubscriptionLimits> {
    try {
      const limitsMap: Record<SubscriptionTier, SubscriptionLimits> = {
        free: {
          maxShops: 1,
          maxQueuesPerDay: 50,
          dataRetentionMonths: 1,
          maxStaff: 1,
          maxSmsPerMonth: 10,
          maxPromotions: 0,
          maxFreePosterDesigns: 3,
          hasAdvancedReports: false,
          hasCustomQrCode: false,
          hasApiAccess: false,
          hasPrioritySupport: false,
          hasCustomBranding: false,
          hasAnalytics: false,
          hasPromotionFeatures: false
        },
        pro: {
          maxShops: 3,
          maxQueuesPerDay: 200,
          dataRetentionMonths: 12,
          maxStaff: 5,
          maxSmsPerMonth: 100,
          maxPromotions: 10,
          maxFreePosterDesigns: 3,
          hasAdvancedReports: true,
          hasCustomQrCode: true,
          hasApiAccess: false,
          hasPrioritySupport: false,
          hasCustomBranding: false,
          hasAnalytics: true,
          hasPromotionFeatures: true
        },
        enterprise: {
          maxShops: null,
          maxQueuesPerDay: null,
          dataRetentionMonths: null,
          maxStaff: null,
          maxSmsPerMonth: null,
          maxPromotions: null,
          maxFreePosterDesigns: 3,
          hasAdvancedReports: true,
          hasCustomQrCode: true,
          hasApiAccess: true,
          hasPrioritySupport: true,
          hasCustomBranding: true,
          hasAnalytics: true,
          hasPromotionFeatures: true
        }
      };

      return limitsMap[tier];
    } catch (error) {
      this.logger.error('SubscriptionService: Error getting limits by tier', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription (mock implementation)
   */
  async getUserSubscription(profileId: string): Promise<UserSubscriptionDto | null> {
    try {
      // Mock implementation - in real app, this would query the database
      this.logger.info(`SubscriptionService: Getting subscription for profile ${profileId}`);

      // For now, return null to indicate no active subscription
      // User will get tier based on their profile role
      return null;
    } catch (error) {
      this.logger.error('SubscriptionService: Error getting user subscription', error);
      throw error;
    }
  }

  /**
   * Get shop tier assignment (mock implementation)
   */
  async getShopTier(shopId: string): Promise<ShopTierDto | null> {
    try {
      this.logger.info(`SubscriptionService: Getting shop tier for shop ${shopId}`);

      // Mock implementation - in real app, this would query the database
      return null;
    } catch (error) {
      this.logger.error('SubscriptionService: Error getting shop tier', error);
      throw error;
    }
  }

  /**
   * Get usage statistics (mock implementation)
   */
  async getUsageStats(profileId: string, shopId?: string): Promise<UsageStatsDto> {
    try {
      this.logger.info(`SubscriptionService: Getting usage stats for profile ${profileId}`);

      // Mock data - in real app, this would query actual usage
      return {
        profileId: profileId,
        shopId,
        currentShops: 2,
        todayQueues: 45,
        currentStaff: 8,
        monthlySmsSent: 120,
        activePromotions: 3,
        usedPosterDesigns: 5,
        paidPosterDesigns: 2,
        totalPosters: 7,
        dataRetentionMonths: 12,
      };
    } catch (error) {
      this.logger.error('SubscriptionService: Error getting usage stats', error);
      throw error;
    }
  }

  /**
   * Get available upgrade options
   */
  async getUpgradeOptions(currentTier: SubscriptionTier): Promise<SubscriptionUpgradeDto[]> {
    try {
      const allOptions: SubscriptionUpgradeDto[] = [
        {
          tier: 'pro',
          name: 'Pro',
          nameEn: 'Pro',
          description: 'เหมาะสำหรับร้านขนาดกลางที่ต้องการฟีเจอร์ครบครัน',
          descriptionEn: 'Perfect for medium-sized shops needing full features',
          monthlyPrice: 299,
          yearlyPrice: 2990,
          oneTimePrice: 399,
          currency: 'THB',
          limits: await this.getLimitsByTier('pro'),
          features: [
            'ร้านค้า 3 ร้าน',
            'คิวสูงสุด 200 คิว/วัน',
            'เก็บข้อมูล 1 ปี',
            'พนักงาน 5 คน',
            'รายงานขั้นสูง + Analytics',
            'SMS 100 ข้อความ/เดือน',
            'QR Code แบบกำหนดเอง',
            'โปรโมชัน 10 รายการ'
          ],
          featuresEn: [
            '3 Shops',
            'Up to 200 queues/day',
            '1 year data retention',
            '5 Staff members',
            'Advanced reports + Analytics',
            '100 SMS/month',
            'Custom QR Code',
            '10 Promotions'
          ],
          isRecommended: true,
          discountPercentage: 17
        },
        {
          tier: 'enterprise',
          name: 'Enterprise',
          nameEn: 'Enterprise',
          description: 'เหมาะสำหรับธุรกิจขนาดใหญ่และเครือข่ายร้านค้า',
          descriptionEn: 'Perfect for large businesses and shop networks',
          monthlyPrice: 999,
          yearlyPrice: 9990,
          oneTimePrice: 1299,
          currency: 'THB',
          limits: await this.getLimitsByTier('enterprise'),
          features: [
            'ร้านค้าไม่จำกัด',
            'คิวไม่จำกัด',
            'เก็บข้อมูลตลอดชีพ',
            'พนักงานไม่จำกัด',
            'รายงานแบบกำหนดเอง + API',
            'SMS ไม่จำกัด',
            'QR Code แบรนด์ของคุณเอง',
            'โปรโมชันไม่จำกัด',
            'การสนับสนุน 24/7',
            'API Access เต็มรูปแบบ'
          ],
          featuresEn: [
            'Unlimited Shops',
            'Unlimited Queues',
            'Lifetime data retention',
            'Unlimited Staff',
            'Custom reports + API',
            'Unlimited SMS',
            'Custom branded QR Code',
            'Unlimited Promotions',
            '24/7 Priority Support',
            'Full API Access'
          ],
          isRecommended: false,
          discountPercentage: 17
        }
      ];

      // Return options higher than current tier
      const tierOrder: SubscriptionTier[] = ['free', 'pro', 'enterprise'];
      const currentIndex = tierOrder.indexOf(currentTier);

      return allOptions.filter(option => {
        const optionIndex = tierOrder.indexOf(option.tier);
        return optionIndex > currentIndex;
      });
    } catch (error) {
      this.logger.error('SubscriptionService: Error getting upgrade options', error);
      throw error;
    }
  }

  /**
   * Check if user can perform action based on limits
   */
  async canPerformAction(profileId: string, action: string, shopId?: string): Promise<boolean> {
    try {
      // Mock implementation - in real app, this would check actual limits
      this.logger.info(`SubscriptionService: Checking if profile ${profileId} can perform ${action} for shop ${shopId}`);

      // For now, return true for all actions
      return true;
    } catch (error) {
      this.logger.error('SubscriptionService: Error checking action permission', error);
      return false;
    }
  }

  /**
   * Upgrade subscription (mock implementation)
   */
  async upgradeSubscription(profileId: string, tier: SubscriptionTier, billingPeriod: 'monthly' | 'yearly'): Promise<UserSubscriptionDto> {
    try {
      this.logger.info(`SubscriptionService: Upgrading subscription for profile ${profileId} to ${tier}`);

      // Mock implementation - in real app, this would process payment and update database
      const limits = await this.getLimitsByTier(tier);
      const prices = { pro: { monthly: 299, yearly: 2990 }, enterprise: { monthly: 999, yearly: 9990 } };

      return {
        id: `sub_${Date.now()}`,
        profileId,
        tier,
        status: 'active',
        billingPeriod,
        startDate: new Date().toISOString(),
        endDate: billingPeriod === 'monthly'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        limits,
        pricePerMonth: prices[tier as keyof typeof prices][billingPeriod],
        currency: 'THB',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('SubscriptionService: Error upgrading subscription', error);
      throw error;
    }
  }

  /**
   * Purchase one-time access (mock implementation)
   */
  async purchaseOneTimeAccess(profileId: string, feature: string, duration: number): Promise<boolean> {
    try {
      this.logger.info(`SubscriptionService: Purchasing one-time access for profile ${profileId} for feature ${feature} for ${duration} days`);

      // Mock implementation - in real app, this would process payment
      return true;
    } catch (error) {
      this.logger.error('SubscriptionService: Error purchasing one-time access', error);
      return false;
    }
  }

  /**
   * Purchase poster design (mock implementation)
   */
  async purchasePosterDesign(profileId: string, posterId: string): Promise<boolean> {
    try {
      this.logger.info(`SubscriptionService: Purchasing poster design ${posterId} for profile ${profileId}`);

      // Mock implementation - in real app, this would process payment and update database
      return true;
    } catch (error) {
      this.logger.error('SubscriptionService: Error purchasing poster design', error);
      return false;
    }
  }

  /**
   * Check if poster is accessible
   */
  async isPosterAccessible(profileId: string, posterId: string): Promise<boolean> {
    try {
      this.logger.info(`SubscriptionService: Checking if poster ${posterId} is accessible for profile ${profileId}`);
      // Mock implementation - first 3 posters are free, rest require payment
      const posterNumber = parseInt(posterId.replace('poster_', ''));

      if (posterNumber <= 3) {
        return true; // First 3 are free
      }

      // Check if user has purchased this poster
      // Mock: return false for now, indicating they need to purchase
      return false;
    } catch (error) {
      this.logger.error('SubscriptionService: Error checking poster accessibility', error);
      return false;
    }
  }
}
