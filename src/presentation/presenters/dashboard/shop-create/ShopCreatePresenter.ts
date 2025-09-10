import { ShopCategoryDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseSubscriptionPresenter } from '../../base/BaseSubscriptionPresenter';


// Define ViewModel interface
export interface ShopCreateViewModel {
  categories: ShopCategoryDTO[];
  maxShopsAllowed: number | null;
  currentShopsCount: number;
  canCreateShop: boolean;
}

// Main Presenter class
export class ShopCreatePresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    private readonly shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  async getViewModel(): Promise<ShopCreateViewModel> {
    try {
      this.logger.info('ShopCreatePresenter: Getting view model');

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get subscription information based on profile
      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      
      // Get shop categories
      const categories = this.getShopCategories();

      const shops = await this.shopService.getShopsByOwnerId(profile.id);
      const currentShopsCount = shops.length;

      // Check if user can create more shops
      const maxShopsAllowed = limits.maxShops;
      const canCreateShop = limits.maxShops === null || shops.length < limits.maxShops;

      return {
        categories,
        maxShopsAllowed,
        currentShopsCount,
        canCreateShop
      };
    } catch (error) {
      this.logger.error('ShopCreatePresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private method for getting shop categories
  private getShopCategories(): ShopCategoryDTO[] {
    return [
      {
        id: 'restaurant',
        name: 'ร้านอาหาร',
        description: 'ร้านอาหาร คาเฟ่ เครื่องดื่ม'
      },
      {
        id: 'beauty',
        name: 'ความงาม',
        description: 'ร้านตัดผม เสริมสวย สปา'
      },
      {
        id: 'healthcare',
        name: 'สุขภาพ',
        description: 'คลินิก โรงพยาบาล ทันตกรรม'
      },
      {
        id: 'retail',
        name: 'ค้าปลีก',
        description: 'ร้านค้าทั่วไป ซูเปอร์มาร์เก็ต'
      },
      {
        id: 'service',
        name: 'บริการ',
        description: 'ซ่อมแซม ซักรีด บริการทั่วไป'
      },
      {
        id: 'government',
        name: 'หน่วยงานราชการ',
        description: 'สำนักงานเขต ที่ว่าการ หน่วยงานรัฐ'
      }
    ];
  }


  // Metadata generation
  generateMetadata() {
    return {
      title: 'สร้างร้านค้าใหม่ | Shop Queue',
      description: 'สร้างร้านค้าใหม่และเริ่มใช้งานระบบจัดการคิวที่ทันสมัย',
    };
  }
}

// Factory class
export class ShopCreatePresenterFactory {
  static async create(): Promise<ShopCreatePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new ShopCreatePresenter(logger, shopService, authService, profileService, subscriptionService);
  }
}
