import type { Logger } from '@/src/domain/interfaces/logger';

// Reward Transaction interface and types
export interface RewardTransaction {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  // Reward Details
  rewardId: string;
  rewardName: string;
  rewardType: 'discount_percentage' | 'discount_amount' | 'free_service' | 'gift_item' | 'points_multiplier';
  rewardValue: number;
  rewardDescription: string;

  // Transaction Details
  pointsUsed: number;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;

  // Status and Tracking
  status: 'pending' | 'approved' | 'redeemed' | 'expired' | 'cancelled';
  transactionDate: Date;
  redeemedDate?: Date;
  expiryDate?: Date;

  // Service/Booking Reference
  bookingId?: string;
  serviceId?: string;
  serviceName?: string;

  // Staff and Notes
  approvedBy?: string;
  redeemedBy?: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface RewardTransactionStats {
  totalTransactions: number;
  totalPointsUsed: number;
  totalDiscountGiven: number;
  totalValueRedeemed: number;

  // Status breakdown
  statusBreakdown: Record<string, number>;

  // Type breakdown
  typeBreakdown: Record<string, number>;

  // Monthly trends
  monthlyTrends: Array<{
    month: string;
    transactions: number;
    pointsUsed: number;
    discountGiven: number;
  }>;

  // Top rewards
  topRewards: Array<{
    rewardId: string;
    rewardName: string;
    rewardType: string;
    redemptionCount: number;
    totalPointsUsed: number;
    totalDiscountGiven: number;
  }>;

  // Recent transactions
  recentTransactions: RewardTransaction[];
}

export interface RewardTransactionFilters {
  status?: string;
  rewardType?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minPoints?: number;
  maxPoints?: number;
  sortBy?: 'transactionDate' | 'pointsUsed' | 'discountAmount' | 'customerName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IRewardTransactionBackendService {
  getRewardTransactions(shopId: string, filters?: RewardTransactionFilters): Promise<RewardTransaction[]>;
  getRewardTransactionById(shopId: string, transactionId: string): Promise<RewardTransaction | null>;
  createRewardTransaction(shopId: string, data: Omit<RewardTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<RewardTransaction>;
  updateRewardTransaction(shopId: string, transactionId: string, data: Partial<RewardTransaction>): Promise<RewardTransaction>;
  deleteRewardTransaction(shopId: string, transactionId: string): Promise<boolean>;
  approveRewardTransaction(shopId: string, transactionId: string, approvedBy: string): Promise<RewardTransaction>;
  redeemRewardTransaction(shopId: string, transactionId: string, redeemedBy: string): Promise<RewardTransaction>;
  cancelRewardTransaction(shopId: string, transactionId: string, reason: string): Promise<RewardTransaction>;
  getRewardTransactionStats(shopId: string, filters?: RewardTransactionFilters): Promise<RewardTransactionStats>;
  exportRewardTransactions(shopId: string, filters?: RewardTransactionFilters): Promise<string>;
}

export class RewardTransactionBackendService implements IRewardTransactionBackendService {
  private mockTransactions: RewardTransaction[] = [
    {
      id: 'rt_001',
      shopId: 'shop1',
      customerId: 'cust_001',
      customerName: 'นางสาวสมใจ ใจดี',
      customerPhone: '081-234-5678',
      customerEmail: 'somjai@email.com',

      rewardId: 'reward_001',
      rewardName: 'ส่วนลด 20% สำหรับบริการตัดผม',
      rewardType: 'discount_percentage',
      rewardValue: 20,
      rewardDescription: 'ส่วนลด 20% สำหรับบริการตัดผมทุกประเภท',

      pointsUsed: 500,
      originalAmount: 300,
      discountAmount: 60,
      finalAmount: 240,

      status: 'redeemed',
      transactionDate: new Date('2024-01-15T10:30:00Z'),
      redeemedDate: new Date('2024-01-15T14:30:00Z'),
      expiryDate: new Date('2024-02-15T23:59:59Z'),

      bookingId: 'booking_001',
      serviceId: 'service_001',
      serviceName: 'ตัดผมชาย',

      approvedBy: 'staff_001',
      redeemedBy: 'staff_002',
      notes: 'ลูกค้า VIP ใช้คะแนนสะสม',

      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z'),
    },
    {
      id: 'rt_002',
      shopId: 'shop1',
      customerId: 'cust_002',
      customerName: 'นายสมชาย รักสวย',
      customerPhone: '082-345-6789',
      customerEmail: 'somchai@email.com',

      rewardId: 'reward_002',
      rewardName: 'บริการฟรี - สระผม',
      rewardType: 'free_service',
      rewardValue: 150,
      rewardDescription: 'บริการสระผมฟรี 1 ครั้ง',

      pointsUsed: 300,
      originalAmount: 150,
      discountAmount: 150,
      finalAmount: 0,

      status: 'approved',
      transactionDate: new Date('2024-01-14T16:45:00Z'),
      expiryDate: new Date('2024-02-14T23:59:59Z'),

      serviceId: 'service_002',
      serviceName: 'สระผม',

      approvedBy: 'staff_001',
      notes: 'รอลูกค้ามาใช้บริการ',

      createdAt: new Date('2024-01-14T16:45:00Z'),
      updatedAt: new Date('2024-01-14T16:45:00Z'),
    },
    {
      id: 'rt_003',
      shopId: 'shop1',
      customerId: 'cust_003',
      customerName: 'นางสาวสุดา สวยงาม',
      customerPhone: '083-456-7890',

      rewardId: 'reward_003',
      rewardName: 'ส่วนลด 100 บาท',
      rewardType: 'discount_amount',
      rewardValue: 100,
      rewardDescription: 'ส่วนลดเงินสด 100 บาท สำหรับบริการทุกประเภท',

      pointsUsed: 200,
      originalAmount: 450,
      discountAmount: 100,
      finalAmount: 350,

      status: 'pending',
      transactionDate: new Date('2024-01-16T09:15:00Z'),
      expiryDate: new Date('2024-02-16T23:59:59Z'),

      bookingId: 'booking_003',
      serviceId: 'service_003',
      serviceName: 'ทำสีผม',

      notes: 'รอการอนุมัติจากผู้จัดการ',

      createdAt: new Date('2024-01-16T09:15:00Z'),
      updatedAt: new Date('2024-01-16T09:15:00Z'),
    },
    {
      id: 'rt_004',
      shopId: 'shop1',
      customerId: 'cust_004',
      customerName: 'นายวิชัย มั่งมี',
      customerPhone: '084-567-8901',

      rewardId: 'reward_004',
      rewardName: 'คะแนนสะสม x2',
      rewardType: 'points_multiplier',
      rewardValue: 2,
      rewardDescription: 'รับคะแนนสะสมเพิ่มเป็น 2 เท่า สำหรับการใช้บริการครั้งถัดไป',

      pointsUsed: 100,

      status: 'expired',
      transactionDate: new Date('2023-12-15T11:20:00Z'),
      expiryDate: new Date('2024-01-15T23:59:59Z'),

      notes: 'หมดอายุแล้ว ไม่ได้ใช้',

      createdAt: new Date('2023-12-15T11:20:00Z'),
      updatedAt: new Date('2024-01-16T00:00:00Z'),
    },
    {
      id: 'rt_005',
      shopId: 'shop1',
      customerId: 'cust_005',
      customerName: 'นางสาวปิยะ น่ารัก',
      customerPhone: '085-678-9012',
      customerEmail: 'piya@email.com',

      rewardId: 'reward_005',
      rewardName: 'ของขวัญ - ผลิตภัณฑ์ดูแลผม',
      rewardType: 'gift_item',
      rewardValue: 250,
      rewardDescription: 'ผลิตภัณฑ์ดูแลผมชุดพิเศษ มูลค่า 250 บาท',

      pointsUsed: 400,

      status: 'cancelled',
      transactionDate: new Date('2024-01-13T13:30:00Z'),

      notes: 'ลูกค้าขอยกเลิก เนื่องจากไม่ต้องการของขวัญ',

      createdAt: new Date('2024-01-13T13:30:00Z'),
      updatedAt: new Date('2024-01-13T15:00:00Z'),
    },
  ];

  constructor(private readonly logger: Logger) { }

  async getRewardTransactions(shopId: string, filters?: RewardTransactionFilters): Promise<RewardTransaction[]> {
    this.logger.info('RewardTransactionBackendService: Getting reward transactions', { shopId, filters });

    let transactions = this.mockTransactions.filter(t => t.shopId === shopId);

    // Apply filters
    if (filters) {
      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status);
      }

      if (filters.rewardType) {
        transactions = transactions.filter(t => t.rewardType === filters.rewardType);
      }

      if (filters.customerId) {
        transactions = transactions.filter(t => t.customerId === filters.customerId);
      }

      if (filters.dateFrom) {
        transactions = transactions.filter(t => t.transactionDate >= filters.dateFrom!);
      }

      if (filters.dateTo) {
        transactions = transactions.filter(t => t.transactionDate <= filters.dateTo!);
      }

      if (filters.minPoints) {
        transactions = transactions.filter(t => t.pointsUsed >= filters.minPoints!);
      }

      if (filters.maxPoints) {
        transactions = transactions.filter(t => t.pointsUsed <= filters.maxPoints!);
      }

      // Sorting
      if (filters.sortBy) {
        transactions.sort((a, b) => {
          let aValue: string | number | Date;
          let bValue: string | number | Date;

          switch (filters.sortBy) {
            case 'transactionDate':
              aValue = a.transactionDate;
              bValue = b.transactionDate;
              break;
            case 'pointsUsed':
              aValue = a.pointsUsed;
              bValue = b.pointsUsed;
              break;
            case 'discountAmount':
              aValue = a.discountAmount || 0;
              bValue = b.discountAmount || 0;
              break;
            case 'customerName':
              aValue = a.customerName;
              bValue = b.customerName;
              break;
            default:
              aValue = a.transactionDate;
              bValue = b.transactionDate;
          }

          if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        });
      }

      // Pagination
      if (filters.page && filters.limit) {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        transactions = transactions.slice(start, end);
      }
    }

    this.logger.info('RewardTransactionBackendService: Retrieved reward transactions', {
      shopId,
      count: transactions.length,
      totalAvailable: this.mockTransactions.filter(t => t.shopId === shopId).length
    });

    return transactions;
  }

  async getRewardTransactionById(shopId: string, transactionId: string): Promise<RewardTransaction | null> {
    this.logger.info('RewardTransactionBackendService: Getting reward transaction by ID', { shopId, transactionId });

    const transaction = this.mockTransactions.find(t => t.id === transactionId && t.shopId === shopId);

    if (!transaction) {
      this.logger.warn('RewardTransactionBackendService: Transaction not found', { shopId, transactionId });
      return null;
    }

    this.logger.info('RewardTransactionBackendService: Retrieved reward transaction', { shopId, transactionId });
    return transaction;
  }

  async createRewardTransaction(shopId: string, data: Omit<RewardTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<RewardTransaction> {
    this.logger.info('RewardTransactionBackendService: Creating reward transaction', { shopId, data });

    const newTransaction: RewardTransaction = {
      ...data,
      id: `rt_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockTransactions.push(newTransaction);

    this.logger.info('RewardTransactionBackendService: Created reward transaction', {
      shopId,
      transactionId: newTransaction.id,
      customerId: newTransaction.customerId,
      pointsUsed: newTransaction.pointsUsed
    });

    return newTransaction;
  }

  async updateRewardTransaction(shopId: string, transactionId: string, data: Partial<RewardTransaction>): Promise<RewardTransaction> {
    this.logger.info('RewardTransactionBackendService: Updating reward transaction', { shopId, transactionId, data });

    const index = this.mockTransactions.findIndex(t => t.id === transactionId && t.shopId === shopId);
    if (index === -1) {
      this.logger.error('RewardTransactionBackendService: Transaction not found for update', { shopId, transactionId });
      throw new Error('Transaction not found');
    }

    this.mockTransactions[index] = {
      ...this.mockTransactions[index],
      ...data,
      updatedAt: new Date(),
    };

    this.logger.info('RewardTransactionBackendService: Updated reward transaction', {
      shopId,
      transactionId,
      updatedFields: Object.keys(data)
    });

    return this.mockTransactions[index];
  }

  async deleteRewardTransaction(shopId: string, transactionId: string): Promise<boolean> {
    this.logger.info('RewardTransactionBackendService: Deleting reward transaction', { shopId, transactionId });

    const index = this.mockTransactions.findIndex(t => t.id === transactionId && t.shopId === shopId);
    if (index === -1) {
      this.logger.warn('RewardTransactionBackendService: Transaction not found for deletion', { shopId, transactionId });
      return false;
    }

    this.mockTransactions.splice(index, 1);

    this.logger.info('RewardTransactionBackendService: Deleted reward transaction', { shopId, transactionId });
    return true;
  }

  async approveRewardTransaction(shopId: string, transactionId: string, approvedBy: string): Promise<RewardTransaction> {
    const transaction = this.mockTransactions.find(t => t.id === transactionId && t.shopId === shopId);
    if (!transaction) {
      throw new Error('ไม่พบรายการที่ต้องการอนุมัติ');
    }

    if (transaction.status !== 'pending') {
      throw new Error('รายการนี้ไม่สามารถอนุมัติได้');
    }

    transaction.status = 'approved';
    transaction.approvedBy = approvedBy;
    transaction.updatedAt = new Date();

    this.logger.info('RewardTransactionBackendService: Approved reward transaction', {
      shopId,
      transactionId,
      approvedBy
    });

    return transaction;
  }

  async redeemRewardTransaction(shopId: string, transactionId: string, redeemedBy: string): Promise<RewardTransaction> {
    this.logger.info('RewardTransactionBackendService: Redeeming reward transaction', { shopId, transactionId, redeemedBy });

    const transaction = await this.updateRewardTransaction(shopId, transactionId, {
      status: 'redeemed',
      redeemedBy,
      redeemedDate: new Date(),
    });

    this.logger.info('RewardTransactionBackendService: Redeemed reward transaction', { shopId, transactionId, redeemedBy });
    return transaction;
  }

  async cancelRewardTransaction(shopId: string, transactionId: string, reason: string): Promise<RewardTransaction> {
    this.logger.info('RewardTransactionBackendService: Cancelling reward transaction', { shopId, transactionId, reason });

    const transaction = await this.updateRewardTransaction(shopId, transactionId, {
      status: 'cancelled',
      notes: reason,
    });

    this.logger.info('RewardTransactionBackendService: Cancelled reward transaction', { shopId, transactionId, reason });
    return transaction;
  }

  async getRewardTransactionStats(shopId: string, filters?: RewardTransactionFilters): Promise<RewardTransactionStats> {
    this.logger.info('RewardTransactionBackendService: Getting reward transaction stats', { shopId, filters });

    const transactions = await this.getRewardTransactions(shopId, { ...filters, page: undefined, limit: undefined });

    const stats: RewardTransactionStats = {
      totalTransactions: transactions.length,
      totalPointsUsed: transactions.reduce((sum, t) => sum + t.pointsUsed, 0),
      totalDiscountGiven: transactions.reduce((sum, t) => sum + (t.discountAmount || 0), 0),
      totalValueRedeemed: transactions.reduce((sum, t) => sum + t.rewardValue, 0),

      statusBreakdown: transactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),

      typeBreakdown: transactions.reduce((acc, t) => {
        acc[t.rewardType] = (acc[t.rewardType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),

      monthlyTrends: [
        { month: '2024-01', transactions: 4, pointsUsed: 1300, discountGiven: 310 },
        { month: '2023-12', transactions: 1, pointsUsed: 100, discountGiven: 0 },
        { month: '2023-11', transactions: 3, pointsUsed: 800, discountGiven: 200 },
      ],

      topRewards: [
        {
          rewardId: 'reward_001',
          rewardName: 'ส่วนลด 20% สำหรับบริการตัดผม',
          rewardType: 'discount_percentage',
          redemptionCount: 2,
          totalPointsUsed: 1000,
          totalDiscountGiven: 120,
        },
        {
          rewardId: 'reward_002',
          rewardName: 'บริการฟรี - สระผม',
          rewardType: 'free_service',
          redemptionCount: 1,
          totalPointsUsed: 300,
          totalDiscountGiven: 150,
        },
      ],

      recentTransactions: transactions.slice(0, 5),
    };

    this.logger.info('RewardTransactionBackendService: Retrieved reward transaction stats', {
      shopId,
      totalTransactions: stats.totalTransactions,
      totalPointsUsed: stats.totalPointsUsed,
      totalDiscountGiven: stats.totalDiscountGiven
    });

    return stats;
  }

  async exportRewardTransactions(shopId: string, filters?: RewardTransactionFilters): Promise<string> {
    const transactions = await this.getRewardTransactions(shopId, filters);

    const csvHeaders = [
      'ID',
      'วันที่ทำรายการ',
      'ชื่อลูกค้า',
      'เบอร์โทร',
      'ชื่อรางวัล',
      'ประเภทรางวัล',
      'คะแนนที่ใช้',
      'จำนวนส่วนลด',
      'สถานะ',
      'วันที่แลก',
      'หมายเหตุ'
    ];

    const csvRows = transactions.map((transaction) => [
      transaction.id,
      transaction.transactionDate.toLocaleDateString('th-TH'),
      transaction.customerName,
      transaction.customerPhone,
      transaction.rewardName,
      transaction.rewardType,
      transaction.pointsUsed.toString(),
      (transaction.discountAmount || 0).toString(),
      transaction.status,
      transaction.redeemedDate?.toLocaleDateString('th-TH') || '',
      transaction.notes || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.join(','))
      .join('\n');

    this.logger.info('RewardTransactionBackendService: Exported reward transactions', {
      shopId,
      count: transactions.length
    });

    return csvContent;
  }
}
