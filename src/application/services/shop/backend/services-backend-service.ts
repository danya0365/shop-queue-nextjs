import type { Logger } from '@/src/domain/interfaces/logger';

// Service interfaces
export interface Service {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  price: number;
  estimatedDuration: number; // minutes
  category: string | null;
  isAvailable: boolean;
  icon: string | null;
  popularityRank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
  estimatedDuration: number;
  category?: string;
  icon?: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  estimatedDuration?: number;
  category?: string;
  isAvailable?: boolean;
  icon?: string;
}

export interface IServicesBackendService {
  getServices(shopId: string): Promise<Service[]>;
  getServiceById(shopId: string, serviceId: string): Promise<Service | null>;
  createService(shopId: string, data: CreateServiceData): Promise<Service>;
  updateService(shopId: string, serviceId: string, data: UpdateServiceData): Promise<Service>;
  deleteService(shopId: string, serviceId: string): Promise<boolean>;
  toggleServiceAvailability(shopId: string, serviceId: string): Promise<Service>;
}

export class ServicesBackendService implements IServicesBackendService {
  constructor(private readonly logger: Logger) { }

  async getServices(shopId: string): Promise<Service[]> {
    this.logger.info('ServicesBackendService: Getting services for shop', { shopId });

    // Mock data - replace with actual repository call
    const mockServices: Service[] = [
      {
        id: '1',
        shopId,
        name: 'ตัดผมชาย',
        description: 'บริการตัดผมสำหรับผู้ชาย ทรงทันสมัย',
        price: 150,
        estimatedDuration: 30,
        category: 'ตัดผม',
        isAvailable: true,
        icon: '✂️',
        popularityRank: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        shopId,
        name: 'ตัดผมหญิง',
        description: 'บริการตัดผมสำหรับผู้หญิง ทรงสวยงาม',
        price: 200,
        estimatedDuration: 45,
        category: 'ตัดผม',
        isAvailable: true,
        icon: '✂️',
        popularityRank: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        shopId,
        name: 'ย้อมสี',
        description: 'บริการย้อมสีผม หลากหลายสี',
        price: 800,
        estimatedDuration: 120,
        category: 'ย้อมสี',
        isAvailable: true,
        icon: '🎨',
        popularityRank: 3,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '4',
        shopId,
        name: 'ดัดผม',
        description: 'บริการดัดผม ทรงสวยงาม',
        price: 600,
        estimatedDuration: 90,
        category: 'ดัดผม',
        isAvailable: false,
        icon: '💇',
        popularityRank: 4,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '5',
        shopId,
        name: 'สระผม',
        description: 'บริการสระผม นวดศีรษะ',
        price: 100,
        estimatedDuration: 20,
        category: 'สระผม',
        isAvailable: true,
        icon: '🚿',
        popularityRank: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return mockServices;
  }

  async getServiceById(shopId: string, serviceId: string): Promise<Service | null> {
    this.logger.info('ServicesBackendService: Getting service by ID', { shopId, serviceId });

    const services = await this.getServices(shopId);
    return services.find(service => service.id === serviceId) || null;
  }

  async createService(shopId: string, data: CreateServiceData): Promise<Service> {
    this.logger.info('ServicesBackendService: Creating service', { shopId, data });

    // Mock implementation - replace with actual repository call
    const newService: Service = {
      id: Date.now().toString(),
      shopId,
      name: data.name,
      description: data.description || null,
      price: data.price,
      estimatedDuration: data.estimatedDuration,
      category: data.category || null,
      isAvailable: true,
      icon: data.icon || null,
      popularityRank: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newService;
  }

  async updateService(shopId: string, serviceId: string, data: UpdateServiceData): Promise<Service> {
    this.logger.info('ServicesBackendService: Updating service', { shopId, serviceId, data });

    const existingService = await this.getServiceById(shopId, serviceId);
    if (!existingService) {
      throw new Error('Service not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedService: Service = {
      ...existingService,
      ...data,
      updatedAt: new Date(),
    };

    return updatedService;
  }

  async deleteService(shopId: string, serviceId: string): Promise<boolean> {
    this.logger.info('ServicesBackendService: Deleting service', { shopId, serviceId });

    const existingService = await this.getServiceById(shopId, serviceId);
    if (!existingService) {
      throw new Error('Service not found');
    }

    // Mock implementation - replace with actual repository call
    return true;
  }

  async toggleServiceAvailability(shopId: string, serviceId: string): Promise<Service> {
    this.logger.info('ServicesBackendService: Toggling service availability', { shopId, serviceId });

    const existingService = await this.getServiceById(shopId, serviceId);
    if (!existingService) {
      throw new Error('Service not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedService: Service = {
      ...existingService,
      isAvailable: !existingService.isAvailable,
      updatedAt: new Date(),
    };

    return updatedService;
  }
}
