import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface CustomerReward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'free_item' | 'cashback' | 'points';
  value: number;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  expiryDate?: string;
  termsAndConditions: string[];
  isAvailable: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface CustomerPoints {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  pointsExpiring: number;
  expiryDate?: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
  tierBenefits: string[];
}

export interface RewardTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  date: string;
  relatedOrderId?: string;
}

export interface AvailableReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  stock?: number;
}

// Define ViewModel interface
export interface CustomerRewardsViewModel {
  customerPoints: CustomerPoints;
  availableRewards: AvailableReward[];
  redeemedRewards: CustomerReward[];
  rewardTransactions: RewardTransaction[];
  customerName: string;
}

// Main Presenter class
export class CustomerRewardsPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<CustomerRewardsViewModel> {
    try {
      this.logger.info('CustomerRewardsPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const customerPoints = this.getCustomerPoints();
      const availableRewards = this.getAvailableRewards();
      const redeemedRewards = this.getRedeemedRewards();
      const rewardTransactions = this.getRewardTransactions();
      
      return {
        customerPoints,
        availableRewards,
        redeemedRewards,
        rewardTransactions,
        customerName: 'สมชาย ลูกค้าดี',
      };
    } catch (error) {
      this.logger.error('CustomerRewardsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getCustomerPoints(): CustomerPoints {
    return {
      currentPoints: 1250,
      totalEarned: 3450,
      totalRedeemed: 2200,
      pointsExpiring: 150,
      expiryDate: '2024-03-15',
      tier: 'Silver',
      nextTierPoints: 750,
      tierBenefits: [
        'ส่วนลด 5% ทุกการซื้อ',
        'แต้มสะสมเพิ่ม 1.5 เท่า',
        'ของรางวัลพิเศษ',
        'ข้ามคิวได้ 2 ครั้งต่อเดือน',
      ],
    };
  }

  private getAvailableRewards(): AvailableReward[] {
    return [
      {
        id: '1',
        name: 'กาแฟฟรี 1 แก้ว',
        description: 'กาแฟขนาดปกติ 1 แก้ว (ยกเว้นเมนูพิเศษ)',
        pointsCost: 500,
        category: 'เครื่องดื่ม',
        imageUrl: '☕',
        isAvailable: true,
        stock: 50,
      },
      {
        id: '2',
        name: 'ส่วนลด 10%',
        description: 'ส่วนลด 10% สำหรับการซื้อครั้งถัดไป (สูงสุด 100 บาท)',
        pointsCost: 300,
        category: 'ส่วนลด',
        imageUrl: '🎫',
        isAvailable: true,
      },
      {
        id: '3',
        name: 'เค้กชิ้นโปรด',
        description: 'เค้กชิ้นโปรด 1 ชิ้น (ยกเว้นเค้กพิเศษ)',
        pointsCost: 800,
        category: 'ขนม',
        imageUrl: '🍰',
        isAvailable: true,
        stock: 20,
      },
      {
        id: '4',
        name: 'ข้ามคิวพิเศษ',
        description: 'สิทธิ์ข้ามคิว 1 ครั้ง (ใช้ได้ภายใน 30 วัน)',
        pointsCost: 200,
        category: 'สิทธิพิเศษ',
        imageUrl: '⚡',
        isAvailable: true,
      },
      {
        id: '5',
        name: 'เซ็ตอาหารเช้า',
        description: 'เซ็ตอาหารเช้าพิเศษ (แซนด์วิช + กาแฟ)',
        pointsCost: 1200,
        category: 'อาหาร',
        imageUrl: '🥪',
        isAvailable: false,
        stock: 0,
      },
      {
        id: '6',
        name: 'คืนเงิน 50 บาท',
        description: 'รับเงินคืน 50 บาท เข้าบัญชี',
        pointsCost: 1000,
        category: 'เงินคืน',
        imageUrl: '💰',
        isAvailable: true,
      },
    ];
  }

  private getRedeemedRewards(): CustomerReward[] {
    return [
      {
        id: '1',
        name: 'กาแฟฟรี 1 แก้ว',
        description: 'กาแฟขนาดปกติ 1 แก้ว',
        type: 'free_item',
        value: 65,
        pointsCost: 500,
        category: 'เครื่องดื่ม',
        imageUrl: '☕',
        termsAndConditions: [
          'ใช้ได้ภายใน 30 วัน',
          'ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้',
          'ใช้ได้เฉพาะสาขาที่แลก',
        ],
        isAvailable: true,
        isRedeemed: true,
        redeemedAt: '2024-01-10',
        expiryDate: '2024-02-10',
      },
      {
        id: '2',
        name: 'ส่วนลด 10%',
        description: 'ส่วนลด 10% สำหรับการซื้อครั้งถัดไป',
        type: 'discount',
        value: 10,
        pointsCost: 300,
        category: 'ส่วนลด',
        imageUrl: '🎫',
        termsAndConditions: [
          'ใช้ได้ภายใน 15 วัน',
          'ส่วนลดสูงสุด 100 บาท',
          'ใช้ได้ครั้งเดียว',
        ],
        isAvailable: false,
        isRedeemed: true,
        redeemedAt: '2024-01-05',
        expiryDate: '2024-01-20',
      },
    ];
  }

  private getRewardTransactions(): RewardTransaction[] {
    return [
      {
        id: '1',
        type: 'earned',
        points: 85,
        description: 'ซื้อกาแฟลาเต้ + เค้กช็อกโกแลต',
        date: '2024-01-15',
        relatedOrderId: 'ORD-001',
      },
      {
        id: '2',
        type: 'redeemed',
        points: -500,
        description: 'แลกกาแฟฟรี 1 แก้ว',
        date: '2024-01-10',
      },
      {
        id: '3',
        type: 'earned',
        points: 65,
        description: 'ซื้อกาแฟอเมริกาโน่ 2 แก้ว',
        date: '2024-01-12',
        relatedOrderId: 'ORD-002',
      },
      {
        id: '4',
        type: 'redeemed',
        points: -300,
        description: 'แลกส่วนลด 10%',
        date: '2024-01-05',
      },
      {
        id: '5',
        type: 'earned',
        points: 120,
        description: 'ซื้อเซ็ตอาหารเช้า + กาแฟคาปูชิโน่',
        date: '2024-01-08',
        relatedOrderId: 'ORD-003',
      },
      {
        id: '6',
        type: 'expired',
        points: -50,
        description: 'แต้มหมดอายุ',
        date: '2024-01-01',
      },
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'รางวัลและแต้มสะสม - ลูกค้า | Shop Queue',
      description: 'ดูแต้มสะสม แลกของรางวัล และติดตามสิทธิประโยชน์ต่างๆ',
    };
  }
}

// Factory class
export class CustomerRewardsPresenterFactory {
  static async create(): Promise<CustomerRewardsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new CustomerRewardsPresenter(logger);
  }
}
