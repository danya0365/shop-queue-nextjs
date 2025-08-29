import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces based on database schema
export interface PaymentItem {
  id: string;
  paymentId: string;
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  createdAt: Date;
  // Additional computed fields
  serviceName?: string;
  serviceCategory?: string;
}

export interface CreatePaymentItemData {
  paymentId: string;
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface UpdatePaymentItemData {
  name?: string;
  price?: number;
  quantity?: number;
}

export interface IPaymentItemsBackendService {
  getPaymentItems(shopId: string): Promise<PaymentItem[]>;
  getPaymentItemsByPaymentId(shopId: string, paymentId: string): Promise<PaymentItem[]>;
  getPaymentItemById(shopId: string, itemId: string): Promise<PaymentItem | null>;
  createPaymentItem(shopId: string, data: CreatePaymentItemData): Promise<PaymentItem>;
  updatePaymentItem(shopId: string, itemId: string, data: UpdatePaymentItemData): Promise<PaymentItem>;
  deletePaymentItem(shopId: string, itemId: string): Promise<boolean>;
  getPaymentItemsStats(shopId: string): Promise<{
    totalItems: number;
    totalRevenue: number;
    averageItemValue: number;
    topSellingItems: PaymentItem[];
  }>;
}

export class PaymentItemsBackendService implements IPaymentItemsBackendService {
  constructor(private readonly logger: Logger) { }

  async getPaymentItems(shopId: string): Promise<PaymentItem[]> {
    this.logger.info('PaymentItemsBackendService: Getting payment items', { shopId });

    // Mock data for payment items
    const mockPaymentItems: PaymentItem[] = [
      {
        id: '1',
        paymentId: 'payment-1',
        serviceId: 'service-1',
        name: 'ตัดผมชาย',
        price: 150,
        quantity: 1,
        total: 150,
        createdAt: new Date('2024-01-01'),
        serviceName: 'ตัดผมชาย',
        serviceCategory: 'ตัดผม',
      },
      {
        id: '2',
        paymentId: 'payment-1',
        serviceId: 'service-2',
        name: 'สระผม',
        price: 100,
        quantity: 1,
        total: 100,
        createdAt: new Date('2024-01-01'),
        serviceName: 'สระผม',
        serviceCategory: 'ดูแลผม',
      },
      {
        id: '3',
        paymentId: 'payment-2',
        serviceId: 'service-3',
        name: 'ย้อมผม',
        price: 800,
        quantity: 1,
        total: 800,
        createdAt: new Date('2024-01-02'),
        serviceName: 'ย้อมผม',
        serviceCategory: 'ทำสี',
      },
      {
        id: '4',
        paymentId: 'payment-3',
        serviceId: 'service-1',
        name: 'ตัดผมชาย',
        price: 150,
        quantity: 2,
        total: 300,
        createdAt: new Date('2024-01-02'),
        serviceName: 'ตัดผมชาย',
        serviceCategory: 'ตัดผม',
      },
      {
        id: '5',
        paymentId: 'payment-4',
        serviceId: 'service-4',
        name: 'ดัดผม',
        price: 1200,
        quantity: 1,
        total: 1200,
        createdAt: new Date('2024-01-03'),
        serviceName: 'ดัดผม',
        serviceCategory: 'จัดแต่งผม',
      },
      {
        id: '6',
        paymentId: 'payment-5',
        serviceId: 'service-2',
        name: 'สระผม',
        price: 100,
        quantity: 3,
        total: 300,
        createdAt: new Date('2024-01-03'),
        serviceName: 'สระผม',
        serviceCategory: 'ดูแลผม',
      },
      {
        id: '7',
        paymentId: 'payment-6',
        serviceId: 'service-5',
        name: 'ทรีทเมนต์ผม',
        price: 500,
        quantity: 1,
        total: 500,
        createdAt: new Date('2024-01-04'),
        serviceName: 'ทรีทเมนต์ผม',
        serviceCategory: 'ดูแลผม',
      },
      {
        id: '8',
        paymentId: 'payment-7',
        serviceId: 'service-6',
        name: 'เซ็ตผม',
        price: 200,
        quantity: 1,
        total: 200,
        createdAt: new Date('2024-01-04'),
        serviceName: 'เซ็ตผม',
        serviceCategory: 'จัดแต่งผม',
      },
    ];

    return mockPaymentItems;
  }

  async getPaymentItemsByPaymentId(shopId: string, paymentId: string): Promise<PaymentItem[]> {
    this.logger.info('PaymentItemsBackendService: Getting payment items by payment ID', { shopId, paymentId });

    const allItems = await this.getPaymentItems(shopId);
    return allItems.filter(item => item.paymentId === paymentId);
  }

  async getPaymentItemById(shopId: string, itemId: string): Promise<PaymentItem | null> {
    this.logger.info('PaymentItemsBackendService: Getting payment item by ID', { shopId, itemId });

    const items = await this.getPaymentItems(shopId);
    return items.find(item => item.id === itemId) || null;
  }

  async createPaymentItem(shopId: string, data: CreatePaymentItemData): Promise<PaymentItem> {
    this.logger.info('PaymentItemsBackendService: Creating payment item', { shopId, data });

    const total = data.price * data.quantity;

    const newItem: PaymentItem = {
      id: Date.now().toString(),
      paymentId: data.paymentId,
      serviceId: data.serviceId,
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      total: total,
      createdAt: new Date(),
    };

    return newItem;
  }

  async updatePaymentItem(shopId: string, itemId: string, data: UpdatePaymentItemData): Promise<PaymentItem> {
    this.logger.info('PaymentItemsBackendService: Updating payment item', { shopId, itemId, data });

    const existingItem = await this.getPaymentItemById(shopId, itemId);
    if (!existingItem) {
      throw new Error(`Payment item with ID ${itemId} not found`);
    }

    const updatedPrice = data.price !== undefined ? data.price : existingItem.price;
    const updatedQuantity = data.quantity !== undefined ? data.quantity : existingItem.quantity;

    const updatedItem: PaymentItem = {
      ...existingItem,
      name: data.name !== undefined ? data.name : existingItem.name,
      price: updatedPrice,
      quantity: updatedQuantity,
      total: updatedPrice * updatedQuantity,
    };

    return updatedItem;
  }

  async deletePaymentItem(shopId: string, itemId: string): Promise<boolean> {
    this.logger.info('PaymentItemsBackendService: Deleting payment item', { shopId, itemId });

    const existingItem = await this.getPaymentItemById(shopId, itemId);
    if (!existingItem) {
      return false;
    }

    // In real implementation, delete from database
    return true;
  }

  async getPaymentItemsStats(shopId: string): Promise<{
    totalItems: number;
    totalRevenue: number;
    averageItemValue: number;
    topSellingItems: PaymentItem[];
  }> {
    this.logger.info('PaymentItemsBackendService: Getting payment items statistics', { shopId });

    const items = await this.getPaymentItems(shopId);

    const totalItems = items.length;
    const totalRevenue = items.reduce((sum, item) => sum + item.total, 0);
    const averageItemValue = totalItems > 0 ? totalRevenue / totalItems : 0;

    // Group by service and calculate quantities
    const serviceStats = items.reduce((acc, item) => {
      const key = item.serviceId;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          quantity: 0,
          total: 0,
        };
      }
      acc[key].quantity += item.quantity;
      acc[key].total += item.total;
      return acc;
    }, {} as Record<string, PaymentItem>);

    // Get top selling items (by quantity)
    const topSellingItems = Object.values(serviceStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalItems,
      totalRevenue,
      averageItemValue,
      topSellingItems,
    };
  }
}
