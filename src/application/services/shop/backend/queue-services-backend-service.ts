import type { Logger } from '@/src/domain/interfaces/logger';

// Queue Service interface and types
export interface QueueService {
  id: string;
  shopId: string;
  serviceId: string;
  serviceName: string;
  departmentId: string;
  departmentName: string;
  estimatedDuration: number; // in minutes
  maxCapacity: number;
  currentQueue: number;
  isActive: boolean;
  priority: number;
  description?: string;
  requirements?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalCapacity: number;
  currentTotalQueue: number;
  averageWaitTime: number;
  busyServices: QueueService[];
  availableServices: QueueService[];
}

export interface IQueueServiceBackendService {
  getQueueServices(shopId: string): Promise<QueueService[]>;
  getQueueServiceById(id: string): Promise<QueueService | null>;
  createQueueService(shopId: string, data: Omit<QueueService, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueService>;
  updateQueueService(id: string, data: Partial<QueueService>): Promise<QueueService>;
  deleteQueueService(id: string): Promise<void>;
  toggleServiceStatus(id: string): Promise<QueueService>;
  getQueueServiceStats(shopId: string): Promise<QueueServiceStats>;
  getServicesByDepartment(shopId: string, departmentId: string): Promise<QueueService[]>;
  updateServicePriority(id: string, priority: number): Promise<QueueService>;
}

export class QueueServiceBackendService implements IQueueServiceBackendService {
  private mockQueueServices: QueueService[] = [
    {
      id: '1',
      shopId: 'shop1',
      serviceId: 'service1',
      serviceName: 'ตัดผมชาย',
      departmentId: 'dept1',
      departmentName: 'แผนกตัดผม',
      estimatedDuration: 30,
      maxCapacity: 5,
      currentQueue: 3,
      isActive: true,
      priority: 1,
      description: 'บริการตัดผมสำหรับผู้ชาย ทุกสไตล์',
      requirements: 'โปรดมาก่อนเวลานัด 10 นาที',
      createdAt: new Date('2024-01-01T08:00:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: '2',
      shopId: 'shop1',
      serviceId: 'service2',
      serviceName: 'ตัดผมหญิง',
      departmentId: 'dept1',
      departmentName: 'แผนกตัดผม',
      estimatedDuration: 45,
      maxCapacity: 4,
      currentQueue: 2,
      isActive: true,
      priority: 2,
      description: 'บริการตัดผมสำหรับผู้หญิง พร้อมปรึกษาสไตล์',
      requirements: 'กรุณาล้างผมก่อนมา',
      createdAt: new Date('2024-01-01T08:00:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: '3',
      shopId: 'shop1',
      serviceId: 'service3',
      serviceName: 'ย้อมสีผม',
      departmentId: 'dept2',
      departmentName: 'แผนกสีผม',
      estimatedDuration: 120,
      maxCapacity: 2,
      currentQueue: 1,
      isActive: true,
      priority: 3,
      description: 'บริการย้อมสีผม ทุกสี ปลอดภัย',
      requirements: 'ห้ามล้างผม 2 วันก่อนย้อม',
      createdAt: new Date('2024-01-02T09:00:00Z'),
      updatedAt: new Date('2024-01-16T14:20:00Z'),
    },
    {
      id: '4',
      shopId: 'shop1',
      serviceId: 'service4',
      serviceName: 'ดัดผม',
      departmentId: 'dept2',
      departmentName: 'แผนกสีผม',
      estimatedDuration: 180,
      maxCapacity: 1,
      currentQueue: 0,
      isActive: true,
      priority: 4,
      description: 'บริการดัดผม เทคนิคใหม่ ไม่เสียผม',
      requirements: 'ผมต้องยาวอย่างน้อย 15 ซม.',
      createdAt: new Date('2024-01-02T09:00:00Z'),
      updatedAt: new Date('2024-01-16T14:20:00Z'),
    },
    {
      id: '5',
      shopId: 'shop1',
      serviceId: 'service5',
      serviceName: 'นวดหัว',
      departmentId: 'dept3',
      departmentName: 'แผนกสปา',
      estimatedDuration: 60,
      maxCapacity: 3,
      currentQueue: 1,
      isActive: true,
      priority: 5,
      description: 'บริการนวดหัว ผ่อนคลาย บำรุงหนังศีรษะ',
      requirements: 'แนะนำสำหรับผู้ที่มีปัญหาเส้นผมร่วง',
      createdAt: new Date('2024-01-03T10:00:00Z'),
      updatedAt: new Date('2024-01-17T11:15:00Z'),
    },
    {
      id: '6',
      shopId: 'shop1',
      serviceId: 'service6',
      serviceName: 'ทรีทเมนต์ผม',
      departmentId: 'dept3',
      departmentName: 'แผนกสปา',
      estimatedDuration: 90,
      maxCapacity: 2,
      currentQueue: 0,
      isActive: false,
      priority: 6,
      description: 'บริการบำรุงผมเสีย ฟื้นฟูเส้นผม',
      requirements: 'ผมต้องไม่เปียกเมื่อมารับบริการ',
      createdAt: new Date('2024-01-03T10:00:00Z'),
      updatedAt: new Date('2024-01-17T11:15:00Z'),
    },
    {
      id: '7',
      shopId: 'shop1',
      serviceId: 'service7',
      serviceName: 'โกนหนวด',
      departmentId: 'dept4',
      departmentName: 'แผนกบาร์เบอร์',
      estimatedDuration: 20,
      maxCapacity: 6,
      currentQueue: 4,
      isActive: true,
      priority: 7,
      description: 'บริการโกนหนวดแบบดั้งเดิม ด้วยมีดโกน',
      requirements: 'สำหรับผู้ชายเท่านั้น',
      createdAt: new Date('2024-01-04T07:30:00Z'),
      updatedAt: new Date('2024-01-18T09:45:00Z'),
    },
    {
      id: '8',
      shopId: 'shop1',
      serviceId: 'service8',
      serviceName: 'จัดแต่งทรงผม',
      departmentId: 'dept4',
      departmentName: 'แผนกบาร์เบอร์',
      estimatedDuration: 40,
      maxCapacity: 4,
      currentQueue: 2,
      isActive: true,
      priority: 8,
      description: 'บริการจัดแต่งทรงผม สไตล์คลาสสิค',
      requirements: 'ผมต้องสะอาด',
      createdAt: new Date('2024-01-04T07:30:00Z'),
      updatedAt: new Date('2024-01-18T09:45:00Z'),
    },
  ];

  constructor(private readonly logger: Logger) { }

  async getQueueServices(shopId: string): Promise<QueueService[]> {
    this.logger.info('QueueServiceBackendService: Getting queue services', { shopId });

    // Filter by shopId
    const services = this.mockQueueServices.filter(service => service.shopId === shopId);

    this.logger.info('QueueServiceBackendService: Retrieved queue services', {
      shopId,
      count: services.length
    });

    return services;
  }

  async getQueueServiceById(id: string): Promise<QueueService | null> {
    this.logger.info('QueueServiceBackendService: Getting queue service by ID', { id });

    const service = this.mockQueueServices.find(service => service.id === id);

    if (!service) {
      this.logger.warn('QueueServiceBackendService: Queue service not found', { id });
      return null;
    }

    return service;
  }

  async createQueueService(shopId: string, data: Omit<QueueService, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueService> {
    this.logger.info('QueueServiceBackendService: Creating queue service', { shopId, data });

    const newService: QueueService = {
      ...data,
      id: `service_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockQueueServices.push(newService);

    this.logger.info('QueueServiceBackendService: Queue service created', {
      id: newService.id,
      serviceName: newService.serviceName
    });

    return newService;
  }

  async updateQueueService(id: string, data: Partial<QueueService>): Promise<QueueService> {
    this.logger.info('QueueServiceBackendService: Updating queue service', { id, data });

    const serviceIndex = this.mockQueueServices.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      this.logger.error('QueueServiceBackendService: Queue service not found for update', { id });
      throw new Error('Queue service not found');
    }

    const updatedService = {
      ...this.mockQueueServices[serviceIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.mockQueueServices[serviceIndex] = updatedService;

    this.logger.info('QueueServiceBackendService: Queue service updated', {
      id: updatedService.id,
      serviceName: updatedService.serviceName
    });

    return updatedService;
  }

  async deleteQueueService(id: string): Promise<void> {
    this.logger.info('QueueServiceBackendService: Deleting queue service', { id });

    const serviceIndex = this.mockQueueServices.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      this.logger.error('QueueServiceBackendService: Queue service not found for deletion', { id });
      throw new Error('Queue service not found');
    }

    const deletedService = this.mockQueueServices[serviceIndex];
    this.mockQueueServices.splice(serviceIndex, 1);

    this.logger.info('QueueServiceBackendService: Queue service deleted', {
      id,
      serviceName: deletedService.serviceName
    });
  }

  async toggleServiceStatus(id: string): Promise<QueueService> {
    this.logger.info('QueueServiceBackendService: Toggling service status', { id });

    const serviceIndex = this.mockQueueServices.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      this.logger.error('QueueServiceBackendService: Queue service not found for status toggle', { id });
      throw new Error('Queue service not found');
    }

    const service = this.mockQueueServices[serviceIndex];
    service.isActive = !service.isActive;
    service.updatedAt = new Date();

    this.logger.info('QueueServiceBackendService: Service status toggled', {
      id,
      serviceName: service.serviceName,
      isActive: service.isActive
    });

    return service;
  }

  async getQueueServiceStats(shopId: string): Promise<QueueServiceStats> {
    this.logger.info('QueueServiceBackendService: Getting queue service stats', { shopId });

    const services = await this.getQueueServices(shopId);

    const totalServices = services.length;
    const activeServices = services.filter(service => service.isActive).length;
    const inactiveServices = totalServices - activeServices;
    const totalCapacity = services.reduce((sum, service) => sum + service.maxCapacity, 0);
    const currentTotalQueue = services.reduce((sum, service) => sum + service.currentQueue, 0);

    // Calculate average wait time based on queue and duration
    const totalWaitTime = services.reduce((sum, service) => {
      if (service.currentQueue > 0 && service.isActive) {
        return sum + (service.currentQueue * service.estimatedDuration);
      }
      return sum;
    }, 0);

    const averageWaitTime = activeServices > 0 ? Math.round(totalWaitTime / activeServices) : 0;

    // Get busy services (queue > 50% of capacity)
    const busyServices = services.filter(service =>
      service.isActive && service.currentQueue > (service.maxCapacity * 0.5)
    );

    // Get available services (queue < 50% of capacity and active)
    const availableServices = services.filter(service =>
      service.isActive && service.currentQueue <= (service.maxCapacity * 0.5)
    );

    const stats = {
      totalServices,
      activeServices,
      inactiveServices,
      totalCapacity,
      currentTotalQueue,
      averageWaitTime,
      busyServices,
      availableServices,
    };

    this.logger.info('QueueServiceBackendService: Queue service stats calculated', {
      shopId,
      stats: {
        totalServices,
        activeServices,
        currentTotalQueue,
        averageWaitTime
      }
    });

    return stats;
  }

  async getServicesByDepartment(shopId: string, departmentId: string): Promise<QueueService[]> {
    this.logger.info('QueueServiceBackendService: Getting services by department', { shopId, departmentId });

    const services = this.mockQueueServices.filter(service =>
      service.shopId === shopId && service.departmentId === departmentId
    );

    this.logger.info('QueueServiceBackendService: Retrieved services by department', {
      shopId,
      departmentId,
      count: services.length
    });

    return services;
  }

  async updateServicePriority(id: string, priority: number): Promise<QueueService> {
    this.logger.info('QueueServiceBackendService: Updating service priority', { id, priority });

    const serviceIndex = this.mockQueueServices.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      this.logger.error('QueueServiceBackendService: Queue service not found for priority update', { id });
      throw new Error('Queue service not found');
    }

    const service = this.mockQueueServices[serviceIndex];
    service.priority = priority;
    service.updatedAt = new Date();

    this.logger.info('QueueServiceBackendService: Service priority updated', {
      id,
      serviceName: service.serviceName,
      priority
    });

    return service;
  }
}
