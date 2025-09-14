import { ShopCategoryDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { CategoryService } from '@/src/application/services/category-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import { getClientContainer } from '@/src/di/client-container';
import { Container } from '@/src/di/container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseSubscriptionPresenter } from '../../base/BaseSubscriptionPresenter';

// Define opening hours type
interface OpeningHours {
  dayOfWeek: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
  is24Hours?: boolean;
}


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


  // Create shop method
  async createShop(shopData: {
    name: string;
    description?: string;
    address: string;
    phone: string;
    email?: string;
    ownerId: string;
    categoryIds: string[];
    openingHours: OpeningHours[];
  }): Promise<boolean> {
    try {
      this.logger.info('ShopCreatePresenter: Creating shop', { shopData });

      // Get user profile to check subscription limits
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Check subscription limits
      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      
      const existingShops = await this.shopService.getShopsByOwnerId(profile.id);
      
      if (limits.maxShops !== null && existingShops.length >= limits.maxShops) {
        throw new Error(`คุณไม่สามารถสร้างร้านค้าเพิ่มเติมได้เนื่องจากคุณมีร้านค้าครบแล้ว (สูงสุด ${limits.maxShops} ร้าน)`);
      }

      // Create the shop
      await this.shopService.createShop(shopData);
      
      this.logger.info('ShopCreatePresenter: Shop created successfully');
      return true;
    } catch (error) {
      this.logger.error('ShopCreatePresenter: Error creating shop', error);
      throw error;
    }
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'สร้างร้านค้าใหม่ | Shop Queue',
      description: 'สร้างร้านค้าใหม่และเริ่มใช้งานระบบจัดการคิวที่ทันสมัย',
    };
  }
}

// Base Factory class for reducing code duplication
abstract class BaseShopCreatePresenterFactory {
  protected static async createPresenter(
    getContainer: () => Promise<Container> | Container
  ): Promise<ShopCreatePresenter> {
    try {
      const container = await getContainer();
      const logger = container.resolve<Logger>('Logger');
      const shopService = container.resolve<IShopService>('ShopService');
      const authService = container.resolve<IAuthService>('AuthService');
      const profileService = container.resolve<IProfileService>('ProfileService');
      const subscriptionService = container.resolve<ISubscriptionService>('SubscriptionService');
      const categoryService = container.resolve<CategoryService>('CategoryService');

      return new ShopCreatePresenter(
        logger,
        shopService,
        authService,
        profileService,
        subscriptionService,
        categoryService
      );
    } catch (error) {
      throw new Error(
        `Failed to create ShopCreatePresenter: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}

// Factory class for server-side
export class ShopCreatePresenterFactory extends BaseShopCreatePresenterFactory {
  static async create(): Promise<ShopCreatePresenter> {
    return this.createPresenter(() => getServerContainer());
  }
}

// Factory class for client-side
export class ClientShopCreatePresenterFactory extends BaseShopCreatePresenterFactory {
  static async create(): Promise<ShopCreatePresenter> {
    return this.createPresenter(() => getClientContainer());
  }
}
