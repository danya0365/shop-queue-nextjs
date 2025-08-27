import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  estimatedTime: number;
  category: string;
  available: boolean;
  icon: string;
}

export interface QueueFormData {
  customerName: string;
  customerPhone: string;
  services: string[];
  specialRequests?: string;
  priority: 'normal' | 'urgent';
}

// Define ViewModel interface
export interface QueueJoinViewModel {
  services: ServiceOption[];
  categories: string[];
  estimatedWaitTime: number;
  currentQueueLength: number;
  shopName: string;
  isAcceptingQueues: boolean;
  maxQueueLength: number;
}

// Main Presenter class
export class QueueJoinPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<QueueJoinViewModel> {
    try {
      this.logger.info('QueueJoinPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const services = this.getAvailableServices();
      const categories = this.getServiceCategories(services);
      
      return {
        services,
        categories,
        estimatedWaitTime: 25,
        currentQueueLength: 12,
        shopName: 'ร้านกาแฟดีใจ',
        isAcceptingQueues: true,
        maxQueueLength: 50,
      };
    } catch (error) {
      this.logger.error('QueueJoinPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getAvailableServices(): ServiceOption[] {
    return [
      {
        id: '1',
        name: 'กาแฟอเมริกาโน่',
        price: 65,
        estimatedTime: 5,
        category: 'เครื่องดื่มร้อน',
        available: true,
        icon: '☕',
      },
      {
        id: '2',
        name: 'กาแฟลาเต้',
        price: 85,
        estimatedTime: 7,
        category: 'เครื่องดื่มร้อน',
        available: true,
        icon: '🥛',
      },
      {
        id: '3',
        name: 'กาแฟเย็น',
        price: 75,
        estimatedTime: 6,
        category: 'เครื่องดื่มเย็น',
        available: true,
        icon: '🧊',
      },
      {
        id: '4',
        name: 'ชาเขียวเย็น',
        price: 60,
        estimatedTime: 4,
        category: 'เครื่องดื่มเย็น',
        available: true,
        icon: '🍃',
      },
      {
        id: '5',
        name: 'เค้กช็อกโกแลต',
        price: 120,
        estimatedTime: 3,
        category: 'ขนมหวาน',
        available: true,
        icon: '🍰',
      },
      {
        id: '6',
        name: 'แซนด์วิชแฮม',
        price: 95,
        estimatedTime: 10,
        category: 'อาหาร',
        available: true,
        icon: '🥪',
      },
      {
        id: '7',
        name: 'สลัดผลไม้',
        price: 80,
        estimatedTime: 8,
        category: 'อาหาร',
        available: false,
        icon: '🥗',
      },
    ];
  }

  private getServiceCategories(services: ServiceOption[]): string[] {
    const categories = [...new Set(services.map(service => service.category))];
    return categories;
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'เข้าคิว | Shop Queue',
      description: 'เลือกบริการและเข้าคิวออนไลน์ เพื่อประหยัดเวลารอคอย',
    };
  }
}

// Factory class
export class QueueJoinPresenterFactory {
  static async create(): Promise<QueueJoinPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new QueueJoinPresenter(logger);
  }
}
