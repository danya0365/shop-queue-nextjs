import type { Logger } from '@/src/domain/interfaces/logger';

// Reward interfaces
export interface Reward {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  type: 'discount' | 'free_item' | 'cashback' | 'special_privilege';
  pointsRequired: number;
  value: number;
  isAvailable: boolean;
  expiryDays: number;
  usageLimit?: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional computed fields
  totalRedeemed?: number;
  remainingUsage?: number;
}

export interface CreateRewardData {
  name: string;
  description?: string;
  type: 'discount' | 'free_item' | 'cashback' | 'special_privilege';
  pointsRequired: number;
  value: number;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

export interface UpdateRewardData {
  name?: string;
  description?: string;
  type?: 'discount' | 'free_item' | 'cashback' | 'special_privilege';
  pointsRequired?: number;
  value?: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

export interface IRewardsBackendService {
  getRewards(shopId: string): Promise<Reward[]>;
  getRewardById(shopId: string, rewardId: string): Promise<Reward | null>;
  createReward(shopId: string, data: CreateRewardData): Promise<Reward>;
  updateReward(shopId: string, rewardId: string, data: UpdateRewardData): Promise<Reward>;
  deleteReward(shopId: string, rewardId: string): Promise<boolean>;
  toggleRewardAvailability(shopId: string, rewardId: string): Promise<Reward>;
  getRewardsByType(shopId: string, type: 'discount' | 'free_item' | 'cashback' | 'special_privilege'): Promise<Reward[]>;
}

export class RewardsBackendService implements IRewardsBackendService {
  constructor(private readonly logger: Logger) { }

  async getRewards(shopId: string): Promise<Reward[]> {
    this.logger.info('RewardsBackendService: Getting rewards for shop', { shopId });

    // Mock data - replace with actual repository call
    const mockRewards: Reward[] = [
      {
        id: '1',
        shopId,
        name: 'ส่วนลด 10%',
        description: 'รับส่วนลด 10% สำหรับบริการทุกประเภท',
        type: 'discount',
        pointsRequired: 100,
        value: 10,
        isAvailable: true,
        expiryDays: 30,
        icon: '🎫',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 45,
        usageLimit: undefined,
        remainingUsage: undefined,
      },
      {
        id: '2',
        shopId,
        name: 'ตัดผมฟรี',
        description: 'รับบริการตัดผมฟรี 1 ครั้ง',
        type: 'free_item',
        pointsRequired: 300,
        value: 150,
        isAvailable: true,
        expiryDays: 60,
        usageLimit: 50,
        icon: '✂️',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 12,
        remainingUsage: 38,
      },
      {
        id: '3',
        shopId,
        name: 'คืนเงิน 50 บาท',
        description: 'รับเงินคืน 50 บาท เข้าบัญชี',
        type: 'cashback',
        pointsRequired: 250,
        value: 50,
        isAvailable: true,
        expiryDays: 90,
        usageLimit: 100,
        icon: '💰',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 8,
        remainingUsage: 92,
      },
      {
        id: '4',
        shopId,
        name: 'สิทธิพิเศษ VIP',
        description: 'รับสิทธิพิเศษจองคิวล่วงหน้า และข้ามคิว',
        type: 'special_privilege',
        pointsRequired: 500,
        value: 1,
        isAvailable: true,
        expiryDays: 365,
        usageLimit: 20,
        icon: '👑',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 3,
        remainingUsage: 17,
      },
      {
        id: '5',
        shopId,
        name: 'ส่วนลด 25%',
        description: 'รับส่วนลด 25% สำหรับบริการย้อมสี',
        type: 'discount',
        pointsRequired: 200,
        value: 25,
        isAvailable: false,
        expiryDays: 30,
        usageLimit: 30,
        icon: '🎨',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 30,
        remainingUsage: 0,
      },
      {
        id: '6',
        shopId,
        name: 'สระผมฟรี',
        description: 'รับบริการสระผมฟรี 1 ครั้ง',
        type: 'free_item',
        pointsRequired: 150,
        value: 100,
        isAvailable: true,
        expiryDays: 45,
        usageLimit: undefined,
        icon: '🚿',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalRedeemed: 25,
        remainingUsage: undefined,
      },
    ];

    return mockRewards;
  }

  async getRewardById(shopId: string, rewardId: string): Promise<Reward | null> {
    this.logger.info('RewardsBackendService: Getting reward by ID', { shopId, rewardId });

    const rewards = await this.getRewards(shopId);
    return rewards.find(reward => reward.id === rewardId) || null;
  }

  async createReward(shopId: string, data: CreateRewardData): Promise<Reward> {
    this.logger.info('RewardsBackendService: Creating reward', { shopId, data });

    // Mock implementation - replace with actual repository call
    const newReward: Reward = {
      id: Date.now().toString(),
      shopId,
      name: data.name,
      description: data.description || null,
      type: data.type,
      pointsRequired: data.pointsRequired,
      value: data.value,
      isAvailable: true,
      expiryDays: data.expiryDays || 30,
      usageLimit: data.usageLimit,
      icon: data.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalRedeemed: 0,
      remainingUsage: data.usageLimit,
    };

    return newReward;
  }

  async updateReward(shopId: string, rewardId: string, data: UpdateRewardData): Promise<Reward> {
    this.logger.info('RewardsBackendService: Updating reward', { shopId, rewardId, data });

    const existingReward = await this.getRewardById(shopId, rewardId);
    if (!existingReward) {
      throw new Error('Reward not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedReward: Reward = {
      ...existingReward,
      ...data,
      updatedAt: new Date(),
    };

    return updatedReward;
  }

  async deleteReward(shopId: string, rewardId: string): Promise<boolean> {
    this.logger.info('RewardsBackendService: Deleting reward', { shopId, rewardId });

    const existingReward = await this.getRewardById(shopId, rewardId);
    if (!existingReward) {
      throw new Error('Reward not found');
    }

    // Check if reward has been redeemed
    if (existingReward.totalRedeemed && existingReward.totalRedeemed > 0) {
      throw new Error('Cannot delete reward that has been redeemed. Please deactivate instead.');
    }

    // Mock implementation - replace with actual repository call
    return true;
  }

  async toggleRewardAvailability(shopId: string, rewardId: string): Promise<Reward> {
    this.logger.info('RewardsBackendService: Toggling reward availability', { shopId, rewardId });

    const existingReward = await this.getRewardById(shopId, rewardId);
    if (!existingReward) {
      throw new Error('Reward not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedReward: Reward = {
      ...existingReward,
      isAvailable: !existingReward.isAvailable,
      updatedAt: new Date(),
    };

    return updatedReward;
  }

  async getRewardsByType(shopId: string, type: 'discount' | 'free_item' | 'cashback' | 'special_privilege'): Promise<Reward[]> {
    this.logger.info('RewardsBackendService: Getting rewards by type', { shopId, type });

    const rewards = await this.getRewards(shopId);
    return rewards.filter(reward => reward.type === type);
  }
}
