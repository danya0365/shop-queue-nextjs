import type { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import type { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define interfaces for data structures
export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'service_upgrade';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicableServices: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  usageLimit?: number;
  usedCount: number;
  conditions: string[];
  createdAt: string;
  createdBy: string;
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  totalUsage: number;
  totalDiscount: number;
  topPromotion: {
    name: string;
    usageCount: number;
    discountAmount: number;
  };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface PromotionFilters {
  status: 'all' | 'active' | 'inactive' | 'expired' | 'scheduled';
  type: string;
  search: string;
}

// Define ViewModel interface
export interface PromotionsViewModel {
  promotions: Promotion[];
  services: Service[];
  stats: PromotionStats;
  filters: PromotionFilters;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    isFreeTier: boolean;
    hasPromotionFeature: boolean;
  };
}

// Main Presenter class
export class PromotionsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(shopId: string): Promise<PromotionsViewModel> {
    try {
      this.logger.info('PromotionsPresenter: Getting view model for shop', { shopId });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      const isFreeTier = subscriptionPlan.tier === 'free';
      const hasPromotionFeature = false; // limits.hasPromotions;

      // Mock data - replace with actual service calls
      const promotions = this.getPromotions();
      const services = this.getServices();
      const stats = this.getPromotionStats(promotions);

      return {
        promotions,
        services,
        stats,
        filters: {
          status: 'all',
          type: 'all',
          search: '',
        },
        subscription: {
          limits,
          usage,
          isFreeTier,
          hasPromotionFeature,
        },
      };
    } catch (error) {
      this.logger.error('PromotionsPresenter: Error getting view model', error);
      throw error;
    }
  }



  // Private methods for data preparation
  private getPromotions(): Promotion[] {
    return [
      {
        id: '1',
        name: 'ลด 20% สำหรับลูกค้าใหม่',
        description: 'ส่วนลด 20% สำหรับลูกค้าใหม่ที่ใช้บริการครั้งแรก',
        type: 'percentage',
        value: 20,
        minOrderAmount: 100,
        maxDiscountAmount: 200,
        applicableServices: ['all'],
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'active',
        usageLimit: 100,
        usedCount: 45,
        conditions: ['ลูกค้าใหม่เท่านั้น', 'ใช้ได้ครั้งเดียวต่อคน'],
        createdAt: '2024-01-01',
        createdBy: 'เจ้าของร้าน',
      },
      {
        id: '2',
        name: 'ซื้อ 2 แก้ว ฟรี 1 แก้ว',
        description: 'ซื้อเครื่องดื่ม 2 แก้ว ได้ฟรี 1 แก้ว (แก้วที่ถูกที่สุด)',
        type: 'buy_x_get_y',
        value: 1,
        applicableServices: ['coffee', 'tea', 'smoothie'],
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        status: 'active',
        usedCount: 28,
        conditions: ['ใช้ได้กับเครื่องดื่มเท่านั้น', 'ฟรีแก้วที่ถูกที่สุด'],
        createdAt: '2024-01-10',
        createdBy: 'เจ้าของร้าน',
      },
      {
        id: '3',
        name: 'ส่วนลดวันเกิด 50 บาท',
        description: 'ส่วนลด 50 บาท สำหรับลูกค้าในวันเกิด',
        type: 'fixed_amount',
        value: 50,
        minOrderAmount: 150,
        applicableServices: ['all'],
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        usedCount: 12,
        conditions: ['ต้องแสดงบัตรประชาชน', 'ใช้ได้เฉพาะวันเกิด'],
        createdAt: '2024-01-01',
        createdBy: 'เจ้าของร้าน',
      },
      {
        id: '4',
        name: 'อัพเกรดเครื่องดื่มฟรี',
        description: 'อัพเกรดเครื่องดื่มจากขนาดปกติเป็นขนาดใหญ่ฟรี',
        type: 'service_upgrade',
        value: 0,
        applicableServices: ['coffee', 'tea'],
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        status: 'scheduled',
        usedCount: 0,
        conditions: ['ใช้ได้กับเครื่องดื่มร้อนเท่านั้น'],
        createdAt: '2024-01-20',
        createdBy: 'เจ้าของร้าน',
      },
      {
        id: '5',
        name: 'ลด 15% ช่วงปีใหม่',
        description: 'ส่วนลด 15% สำหรับทุกบริการในช่วงเทศกาลปีใหม่',
        type: 'percentage',
        value: 15,
        applicableServices: ['all'],
        startDate: '2023-12-25',
        endDate: '2024-01-05',
        status: 'expired',
        usedCount: 89,
        conditions: ['ใช้ได้ทุกบริการ'],
        createdAt: '2023-12-20',
        createdBy: 'เจ้าของร้าน',
      },
    ];
  }

  private getServices(): Service[] {
    return [
      { id: 'coffee', name: 'กาแฟ', price: 65, category: 'เครื่องดื่ม' },
      { id: 'tea', name: 'ชา', price: 55, category: 'เครื่องดื่ม' },
      { id: 'smoothie', name: 'สมูทตี้', price: 85, category: 'เครื่องดื่ม' },
      { id: 'cake', name: 'เค้ก', price: 120, category: 'ขนม' },
      { id: 'sandwich', name: 'แซนด์วิช', price: 95, category: 'อาหาร' },
      { id: 'salad', name: 'สลัด', price: 110, category: 'อาหาร' },
    ];
  }

  private getPromotionStats(promotions: Promotion[]): PromotionStats {
    const activePromotions = promotions.filter(p => p.status === 'active').length;
    const totalUsage = promotions.reduce((sum, p) => sum + p.usedCount, 0);

    // Calculate total discount (simplified calculation)
    const totalDiscount = promotions.reduce((sum, p) => {
      if (p.type === 'percentage') {
        return sum + (p.usedCount * 50); // Estimated average discount
      } else if (p.type === 'fixed_amount') {
        return sum + (p.usedCount * p.value);
      }
      return sum + (p.usedCount * 30); // Estimated for other types
    }, 0);

    const topPromotion = promotions.reduce((top, current) =>
      current.usedCount > top.usedCount ? current : top
      , promotions[0]);

    return {
      totalPromotions: promotions.length,
      activePromotions,
      totalUsage,
      totalDiscount,
      topPromotion: {
        name: topPromotion.name,
        usageCount: topPromotion.usedCount,
        discountAmount: topPromotion.type === 'fixed_amount' ?
          topPromotion.usedCount * topPromotion.value :
          topPromotion.usedCount * 50,
      },
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'จัดการโปรโมชั่น',
      'สร้างและจัดการโปรโมชั่น ส่วนลด และข้อเสนอพิเศษสำหรับลูกค้า',
    );
  }
}

// Factory class
export class PromotionsPresenterFactory {
  static async create(): Promise<PromotionsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new PromotionsPresenter(logger, shopService, authService, profileService, subscriptionService);
  }
}
