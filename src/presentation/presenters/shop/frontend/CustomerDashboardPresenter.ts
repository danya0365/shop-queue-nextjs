import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '@/src/presentation/presenters/shop/BaseShopPresenter';

// Define interfaces for data structures
export interface LocalShopOverview {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  rating: number;
  totalReviews: number;
}

export interface QueueStatus {
  currentNumber: string;
  totalWaiting: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export interface PopularService {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedTime: number;
  icon: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon: string;
}

// Define ViewModel interface
export interface CustomerDashboardViewModel {
  shopInfo: LocalShopOverview;
  queueStatus: QueueStatus;
  popularServices: PopularService[];
  promotions: Promotion[];
  canJoinQueue: boolean;
  announcement: string | null;
}

// Main Presenter class
export class CustomerDashboardPresenter extends BaseShopPresenter {
  constructor(logger: Logger) {
    super(logger);
  }

  async getViewModel(shopId: string): Promise<CustomerDashboardViewModel> {
    try {
      this.logger.info('CustomerDashboardPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const shopInfo = this.getLocalShopOverview(shopId);
      const queueStatus = this.getQueueStatus();
      const popularServices = this.getPopularServices();
      const promotions = this.getPromotions();
      
      return {
        shopInfo,
        queueStatus,
        popularServices,
        promotions,
        canJoinQueue: shopInfo.isOpen && queueStatus.totalWaiting < 50,
        announcement: 'วันนี้มีโปรโมชันพิเศษ! ซื้อกาแฟ 2 แก้ว ฟรี 1 แก้ว 🎉',
      };
    } catch (error) {
      this.logger.error('CustomerDashboardPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getLocalShopOverview(shopId: string): LocalShopOverview {
    return {
      id: shopId,
      name: 'ร้านกาแฟดีใจ',
      description: 'ร้านกาแฟสดใหม่ บรรยากาศดี เหมาะสำหรับนั่งทำงานและพักผ่อน',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      phone: '02-123-4567',
      openTime: '07:00',
      closeTime: '20:00',
      isOpen: true,
      rating: 4.8,
      totalReviews: 256,
    };
  }

  private getQueueStatus(): QueueStatus {
    return {
      currentNumber: 'A016',
      totalWaiting: 12,
      estimatedWaitTime: 25,
      averageServiceTime: 8,
    };
  }

  private getPopularServices(): PopularService[] {
    return [
      {
        id: '1',
        name: 'กาแฟอเมริกาโน่',
        price: 65,
        description: 'กาแฟสดชงใหม่ รสชาติเข้มข้น',
        estimatedTime: 5,
        icon: '☕',
      },
      {
        id: '2',
        name: 'กาแฟลาเต้',
        price: 85,
        description: 'กาแฟผสมนมสด หอมมัน',
        estimatedTime: 7,
        icon: '🥛',
      },
      {
        id: '3',
        name: 'เค้กช็อกโกแลต',
        price: 120,
        description: 'เค้กช็อกโกแลตเข้มข้น หวานมัน',
        estimatedTime: 3,
        icon: '🍰',
      },
      {
        id: '4',
        name: 'แซนด์วิชแฮม',
        price: 95,
        description: 'แซนด์วิชแฮมชีส สดใหม่',
        estimatedTime: 10,
        icon: '🥪',
      },
    ];
  }

  private getPromotions(): Promotion[] {
    return [
      {
        id: '1',
        title: 'ซื้อ 2 ฟรี 1',
        description: 'ซื้อกาแฟ 2 แก้ว ฟรี 1 แก้ว',
        discount: 33,
        validUntil: '31/12/2024',
        icon: '🎁',
      },
      {
        id: '2',
        title: 'ลูกค้าใหม่ลด 20%',
        description: 'สำหรับลูกค้าใหม่ทุกเมนู',
        discount: 20,
        validUntil: '15/01/2025',
        icon: '🌟',
      },
    ];
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'หน้าร้าน',
      'เข้าคิวออนไลน์ ติดตามสถานะคิว และรับโปรโมชันพิเศษ'
    );
  }
}

// Factory class
export class CustomerDashboardPresenterFactory {
  static async create(): Promise<CustomerDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new CustomerDashboardPresenter(logger);
  }
}
