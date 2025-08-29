import type { Logger } from '@/src/domain/interfaces/logger';

// Customer interfaces
export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string | null;
  profileId: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Additional computed fields
  totalVisits?: number;
  lastVisit?: Date;
  totalSpent?: number;
  loyaltyPoints?: number;
}

export interface CreateCustomerData {
  name: string;
  phone?: string;
  profileId?: string;
}

export interface UpdateCustomerData {
  name?: string;
  phone?: string;
}

export interface ICustomersBackendService {
  getCustomers(shopId: string): Promise<Customer[]>;
  getCustomerById(shopId: string, customerId: string): Promise<Customer | null>;
  createCustomer(shopId: string, data: CreateCustomerData): Promise<Customer>;
  updateCustomer(shopId: string, customerId: string, data: UpdateCustomerData): Promise<Customer>;
  deleteCustomer(shopId: string, customerId: string): Promise<boolean>;
  searchCustomers(shopId: string, query: string): Promise<Customer[]>;
}

export class CustomersBackendService implements ICustomersBackendService {
  constructor(private readonly logger: Logger) { }

  async getCustomers(shopId: string): Promise<Customer[]> {
    this.logger.info('CustomersBackendService: Getting customers for shop', { shopId });

    // Mock data - replace with actual repository call
    const mockCustomers: Customer[] = [
      {
        id: '1',
        shopId,
        name: 'สมชาย ใจดี',
        phone: '081-234-5678',
        profileId: 'profile-1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        totalVisits: 15,
        lastVisit: new Date('2024-08-25'),
        totalSpent: 2250,
        loyaltyPoints: 450,
      },
      {
        id: '2',
        shopId,
        name: 'สมหญิง รักสวย',
        phone: '082-345-6789',
        profileId: 'profile-2',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
        totalVisits: 8,
        lastVisit: new Date('2024-08-20'),
        totalSpent: 1600,
        loyaltyPoints: 320,
      },
      {
        id: '3',
        shopId,
        name: 'วิชัย เก่งมาก',
        phone: '083-456-7890',
        profileId: null,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05'),
        totalVisits: 3,
        lastVisit: new Date('2024-08-15'),
        totalSpent: 450,
        loyaltyPoints: 90,
      },
      {
        id: '4',
        shopId,
        name: 'นิดา สวยงาม',
        phone: '084-567-8901',
        profileId: 'profile-4',
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2024-04-20'),
        totalVisits: 12,
        lastVisit: new Date('2024-08-28'),
        totalSpent: 3600,
        loyaltyPoints: 720,
      },
      {
        id: '5',
        shopId,
        name: 'ประยุทธ์ มั่นใจ',
        phone: '085-678-9012',
        profileId: null,
        createdAt: new Date('2024-05-12'),
        updatedAt: new Date('2024-05-12'),
        totalVisits: 6,
        lastVisit: new Date('2024-08-22'),
        totalSpent: 900,
        loyaltyPoints: 180,
      },
      {
        id: '6',
        shopId,
        name: 'อรุณี ใสใส',
        phone: null,
        profileId: null,
        createdAt: new Date('2024-06-08'),
        updatedAt: new Date('2024-06-08'),
        totalVisits: 1,
        lastVisit: new Date('2024-06-08'),
        totalSpent: 150,
        loyaltyPoints: 30,
      },
    ];

    return mockCustomers;
  }

  async getCustomerById(shopId: string, customerId: string): Promise<Customer | null> {
    this.logger.info('CustomersBackendService: Getting customer by ID', { shopId, customerId });

    const customers = await this.getCustomers(shopId);
    return customers.find(customer => customer.id === customerId) || null;
  }

  async createCustomer(shopId: string, data: CreateCustomerData): Promise<Customer> {
    this.logger.info('CustomersBackendService: Creating customer', { shopId, data });

    // Mock implementation - replace with actual repository call
    const newCustomer: Customer = {
      id: Date.now().toString(),
      shopId,
      name: data.name,
      phone: data.phone || null,
      profileId: data.profileId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalVisits: 0,
      lastVisit: undefined,
      totalSpent: 0,
      loyaltyPoints: 0,
    };

    return newCustomer;
  }

  async updateCustomer(shopId: string, customerId: string, data: UpdateCustomerData): Promise<Customer> {
    this.logger.info('CustomersBackendService: Updating customer', { shopId, customerId, data });

    const existingCustomer = await this.getCustomerById(shopId, customerId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedCustomer: Customer = {
      ...existingCustomer,
      ...data,
      updatedAt: new Date(),
    };

    return updatedCustomer;
  }

  async deleteCustomer(shopId: string, customerId: string): Promise<boolean> {
    this.logger.info('CustomersBackendService: Deleting customer', { shopId, customerId });

    const existingCustomer = await this.getCustomerById(shopId, customerId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Mock implementation - replace with actual repository call
    return true;
  }

  async searchCustomers(shopId: string, query: string): Promise<Customer[]> {
    this.logger.info('CustomersBackendService: Searching customers', { shopId, query });

    const customers = await this.getCustomers(shopId);
    const lowercaseQuery = query.toLowerCase();

    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      (customer.phone && customer.phone.includes(query))
    );
  }
}
