import { ShopCategoryDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { ShopBackendShopsService } from '@/src/application/services/shop/backend/BackendShopsService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';


// Define ViewModel interface
export interface ShopCreateViewModel {
  categories: ShopCategoryDTO[];
  maxShopsAllowed: number;
  currentShopsCount: number;
  canCreateShop: boolean;
}

// Main Presenter class
export class ShopCreatePresenter {
  constructor(private readonly logger: Logger, private readonly shopBackendShopsService: ShopBackendShopsService) { }

  async getViewModel(): Promise<ShopCreateViewModel> {
    try {
      this.logger.info('ShopCreatePresenter: Getting view model');

      // Get shop categories
      const categories = this.getShopCategories();

      // Get user's current shop limits (mock data for now)
      const maxShopsAllowed = 3; // This would come from subscription service
      const currentShopsCount = 1; // This would come from shop service
      const canCreateShop = currentShopsCount < maxShopsAllowed;

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
    const shopBackendShopsService = serverContainer.resolve<ShopBackendShopsService>('ShopBackendShopsService');
    return new ShopCreatePresenter(logger, shopBackendShopsService);
  }
}
