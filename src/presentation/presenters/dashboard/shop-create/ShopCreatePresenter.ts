import { ShopCategoryDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { CategoryService } from '@/src/application/services/category-service';
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

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

// Main Presenter class
export class ShopCreatePresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    private readonly shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly categoryService: CategoryService
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
      const categories = await this.getShopCategories();

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
  private async getShopCategories(): Promise<Category[]> {
    const categories = await this.categoryService.getActiveCategories();
    return categories.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description
    }));
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
    const categoryService = serverContainer.resolve<CategoryService>('CategoryService');
    return new ShopCreatePresenter(logger, shopService, authService, profileService, subscriptionService, categoryService);
  }
}
