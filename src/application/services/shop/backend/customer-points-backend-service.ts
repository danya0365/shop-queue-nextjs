import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces based on database schema
export interface CustomerPoints {
  id: string;
  shopId: string;
  customerId: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits: string[];
  createdAt: Date;
  updatedAt: Date;
  // Additional computed fields
  customerName?: string;
  customerPhone?: string;
  pointsToNextTier?: number;
  nextTier?: string;
}

export interface CreateCustomerPointsData {
  customerId: string;
  currentPoints?: number;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits?: string[];
}

export interface UpdateCustomerPointsData {
  currentPoints?: number;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits?: string[];
}

export interface ICustomerPointsBackendService {
  getCustomerPoints(shopId: string): Promise<CustomerPoints[]>;
  getCustomerPointsById(shopId: string, pointsId: string): Promise<CustomerPoints | null>;
  getCustomerPointsByCustomerId(shopId: string, customerId: string): Promise<CustomerPoints | null>;
  createCustomerPoints(shopId: string, data: CreateCustomerPointsData): Promise<CustomerPoints>;
  updateCustomerPoints(shopId: string, pointsId: string, data: UpdateCustomerPointsData): Promise<CustomerPoints>;
  deleteCustomerPoints(shopId: string, pointsId: string): Promise<boolean>;
  addPoints(shopId: string, customerId: string, points: number, description: string): Promise<CustomerPoints>;
  redeemPoints(shopId: string, customerId: string, points: number, description: string): Promise<CustomerPoints>;
  getPointsStats(shopId: string): Promise<{
    totalCustomers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerCustomer: number;
    tierDistribution: Record<string, number>;
  }>;
}

export class CustomerPointsBackendService implements ICustomerPointsBackendService {
  constructor(private readonly logger: Logger) { }

  async getCustomerPoints(shopId: string): Promise<CustomerPoints[]> {
    this.logger.info('CustomerPointsBackendService: Getting customer points', { shopId });

    // Mock data for customer points
    const mockCustomerPoints: CustomerPoints[] = [
      {
        id: '1',
        shopId,
        customerId: 'customer-1',
        currentPoints: 250,
        totalEarned: 850,
        totalRedeemed: 600,
        membershipTier: 'silver',
        tierBenefits: ['ส่วนลด 5%', 'แต้มพิเศษ x1.2'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        customerName: 'สมชาย ใจดี',
        customerPhone: '081-234-5678',
        pointsToNextTier: 250,
        nextTier: 'gold',
      },
      {
        id: '2',
        shopId,
        customerId: 'customer-2',
        currentPoints: 1200,
        totalEarned: 2400,
        totalRedeemed: 1200,
        membershipTier: 'gold',
        tierBenefits: ['ส่วนลด 10%', 'แต้มพิเศษ x1.5', 'บริการพิเศษ'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-20'),
        customerName: 'สมหญิง รักงาม',
        customerPhone: '082-345-6789',
        pointsToNextTier: 800,
        nextTier: 'platinum',
      },
      {
        id: '3',
        shopId,
        customerId: 'customer-3',
        currentPoints: 80,
        totalEarned: 180,
        totalRedeemed: 100,
        membershipTier: 'bronze',
        tierBenefits: ['แต้มพิเศษ x1.0'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18'),
        customerName: 'วิชัย สุขใส',
        customerPhone: '083-456-7890',
        pointsToNextTier: 170,
        nextTier: 'silver',
      },
      {
        id: '4',
        shopId,
        customerId: 'customer-4',
        currentPoints: 2500,
        totalEarned: 5000,
        totalRedeemed: 2500,
        membershipTier: 'platinum',
        tierBenefits: ['ส่วนลด 15%', 'แต้มพิเศษ x2.0', 'บริการพิเศษ', 'ของขวัญวันเกิด'],
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-22'),
        customerName: 'อรุณ มั่งมี',
        customerPhone: '084-567-8901',
        pointsToNextTier: 0,
        nextTier: 'platinum',
      },
      {
        id: '5',
        shopId,
        customerId: 'customer-5',
        currentPoints: 150,
        totalEarned: 300,
        totalRedeemed: 150,
        membershipTier: 'bronze',
        tierBenefits: ['แต้มพิเศษ x1.0'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
        customerName: 'มาลี ใจบุญ',
        customerPhone: '085-678-9012',
        pointsToNextTier: 100,
        nextTier: 'silver',
      },
      {
        id: '6',
        shopId,
        customerId: 'customer-6',
        currentPoints: 750,
        totalEarned: 1500,
        totalRedeemed: 750,
        membershipTier: 'gold',
        tierBenefits: ['ส่วนลด 10%', 'แต้มพิเศษ x1.5', 'บริการพิเศษ'],
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2024-01-28'),
        customerName: 'ประยุทธ์ ชาญชัย',
        customerPhone: '086-789-0123',
        pointsToNextTier: 1250,
        nextTier: 'platinum',
      },
    ];

    return mockCustomerPoints;
  }

  async getCustomerPointsById(shopId: string, pointsId: string): Promise<CustomerPoints | null> {
    this.logger.info('CustomerPointsBackendService: Getting customer points by ID', { shopId, pointsId });

    const customerPoints = await this.getCustomerPoints(shopId);
    return customerPoints.find(points => points.id === pointsId) || null;
  }

  async getCustomerPointsByCustomerId(shopId: string, customerId: string): Promise<CustomerPoints | null> {
    this.logger.info('CustomerPointsBackendService: Getting customer points by customer ID', { shopId, customerId });

    const customerPoints = await this.getCustomerPoints(shopId);
    return customerPoints.find(points => points.customerId === customerId) || null;
  }

  async createCustomerPoints(shopId: string, data: CreateCustomerPointsData): Promise<CustomerPoints> {
    this.logger.info('CustomerPointsBackendService: Creating customer points', { shopId, data });

    const newCustomerPoints: CustomerPoints = {
      id: Date.now().toString(),
      shopId,
      customerId: data.customerId,
      currentPoints: data.currentPoints || 0,
      totalEarned: data.currentPoints || 0,
      totalRedeemed: 0,
      membershipTier: data.membershipTier || 'bronze',
      tierBenefits: data.tierBenefits || ['แต้มพิเศษ x1.0'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newCustomerPoints;
  }

  async updateCustomerPoints(shopId: string, pointsId: string, data: UpdateCustomerPointsData): Promise<CustomerPoints> {
    this.logger.info('CustomerPointsBackendService: Updating customer points', { shopId, pointsId, data });

    const existingPoints = await this.getCustomerPointsById(shopId, pointsId);
    if (!existingPoints) {
      throw new Error(`Customer points with ID ${pointsId} not found`);
    }

    const updatedPoints: CustomerPoints = {
      ...existingPoints,
      currentPoints: data.currentPoints !== undefined ? data.currentPoints : existingPoints.currentPoints,
      membershipTier: data.membershipTier !== undefined ? data.membershipTier : existingPoints.membershipTier,
      tierBenefits: data.tierBenefits !== undefined ? data.tierBenefits : existingPoints.tierBenefits,
      updatedAt: new Date(),
    };

    return updatedPoints;
  }

  async deleteCustomerPoints(shopId: string, pointsId: string): Promise<boolean> {
    this.logger.info('CustomerPointsBackendService: Deleting customer points', { shopId, pointsId });

    const existingPoints = await this.getCustomerPointsById(shopId, pointsId);
    if (!existingPoints) {
      return false;
    }

    // In real implementation, delete from database
    return true;
  }

  async addPoints(shopId: string, customerId: string, points: number, description: string): Promise<CustomerPoints> {
    this.logger.info('CustomerPointsBackendService: Adding points', { shopId, customerId, points, description });

    const customerPoints = await this.getCustomerPointsByCustomerId(shopId, customerId);
    if (!customerPoints) {
      throw new Error(`Customer points for customer ${customerId} not found`);
    }

    const updatedPoints: CustomerPoints = {
      ...customerPoints,
      currentPoints: customerPoints.currentPoints + points,
      totalEarned: customerPoints.totalEarned + points,
      updatedAt: new Date(),
    };

    // Check for tier upgrade
    const newTier = this.calculateTier(updatedPoints.totalEarned);
    if (newTier !== updatedPoints.membershipTier) {
      updatedPoints.membershipTier = newTier;
      updatedPoints.tierBenefits = this.getTierBenefits(newTier);
    }

    return updatedPoints;
  }

  async redeemPoints(shopId: string, customerId: string, points: number, description: string): Promise<CustomerPoints> {
    this.logger.info('CustomerPointsBackendService: Redeeming points', { shopId, customerId, points, description });

    const customerPoints = await this.getCustomerPointsByCustomerId(shopId, customerId);
    if (!customerPoints) {
      throw new Error(`Customer points for customer ${customerId} not found`);
    }

    if (customerPoints.currentPoints < points) {
      throw new Error(`Insufficient points. Current: ${customerPoints.currentPoints}, Required: ${points}`);
    }

    const updatedPoints: CustomerPoints = {
      ...customerPoints,
      currentPoints: customerPoints.currentPoints - points,
      totalRedeemed: customerPoints.totalRedeemed + points,
      updatedAt: new Date(),
    };

    return updatedPoints;
  }

  async getPointsStats(shopId: string): Promise<{
    totalCustomers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerCustomer: number;
    tierDistribution: Record<string, number>;
  }> {
    this.logger.info('CustomerPointsBackendService: Getting points statistics', { shopId });

    const customerPoints = await this.getCustomerPoints(shopId);

    const totalCustomers = customerPoints.length;
    const totalPointsIssued = customerPoints.reduce((sum, points) => sum + points.totalEarned, 0);
    const totalPointsRedeemed = customerPoints.reduce((sum, points) => sum + points.totalRedeemed, 0);
    const averagePointsPerCustomer = totalCustomers > 0 ? totalPointsIssued / totalCustomers : 0;

    const tierDistribution = customerPoints.reduce((acc, points) => {
      acc[points.membershipTier] = (acc[points.membershipTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCustomers,
      totalPointsIssued,
      totalPointsRedeemed,
      averagePointsPerCustomer,
      tierDistribution,
    };
  }

  private calculateTier(totalEarned: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (totalEarned >= 2000) return 'platinum';
    if (totalEarned >= 500) return 'gold';
    if (totalEarned >= 250) return 'silver';
    return 'bronze';
  }

  private getTierBenefits(tier: 'bronze' | 'silver' | 'gold' | 'platinum'): string[] {
    switch (tier) {
      case 'bronze':
        return ['แต้มพิเศษ x1.0'];
      case 'silver':
        return ['ส่วนลด 5%', 'แต้มพิเศษ x1.2'];
      case 'gold':
        return ['ส่วนลด 10%', 'แต้มพิเศษ x1.5', 'บริการพิเศษ'];
      case 'platinum':
        return ['ส่วนลด 15%', 'แต้มพิเศษ x2.0', 'บริการพิเศษ', 'ของขวัญวันเกิด'];
      default:
        return ['แต้มพิเศษ x1.0'];
    }
  }
}
