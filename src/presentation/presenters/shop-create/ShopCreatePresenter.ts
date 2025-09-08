import { AuthUserDto } from '@/src/application/dtos/auth-dto';
import { ProfileDto } from '@/src/application/dtos/profile-dto';
import { ShopCategoryDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { ProfileService } from '@/src/application/services/profile-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { SubscriptionService } from '@/src/application/services/subscription-service';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';


// Define ViewModel interface
export interface ShopCreateViewModel {
  categories: ShopCategoryDTO[];
  maxShopsAllowed: number | null;
  currentShopsCount: number;
  canCreateShop: boolean;
}

// Main Presenter class
export class ShopCreatePresenter {
  constructor(
    private readonly logger: Logger,
    private readonly shopService: IShopService,
    private readonly authService: IAuthService,
    private readonly profileService: ProfileService,
    private readonly subscriptionService: SubscriptionService
  ) { }

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

      // Get subscription information based on user role
      const tier = this.subscriptionService.getTierByRole(profile.role);
      const limits = await this.subscriptionService.getLimitsByTier(tier);

      // Get shop categories
      const categories = this.getShopCategories();

      const shops = await this.shopService.getShopsByOwnerId(profile.id);
      const currentShopsCount = shops.length;

      // Get user's current shop limits (mock data for now)
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

  private async getUser(): Promise<AuthUserDto | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (err) {
      this.logger.error("Error accessing authentication:", err as Error);
      return null;
    }
  }

  /**
   * Get the current authenticated user
   */
  private async getActiveProfile(user: AuthUserDto): Promise<ProfileDto | null> {
    try {
      return await this.profileService.getActiveProfileByAuthId(user.id);
    } catch (err) {
      this.logger.error("Error accessing authentication:", err as Error);
      return null;
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

// Factory class
export class ShopCreatePresenterFactory {
  static async create(): Promise<ShopCreatePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const profileService = serverContainer.resolve<ProfileService>('ProfileService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const subscriptionService = serverContainer.resolve<SubscriptionService>('SubscriptionService');
    return new ShopCreatePresenter(logger, shopService, authService, profileService, subscriptionService);
  }
}
