import type { Logger } from '@/src/domain/interfaces/logger';

// Customer Points Transaction interface and types
export interface CustomerPointsTransaction {
  id: string;
  shopId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  transactionType: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number;
  description: string;
  referenceType?: 'purchase' | 'reward' | 'promotion' | 'manual' | 'expiration';
  referenceId?: string;
  previousBalance: number;
  newBalance: number;
  employeeId?: string;
  employeeName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerPointsTransactionStats {
  totalTransactions: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalPointsExpired: number;
  totalPointsAdjusted: number;
  transactionsByType: Record<string, number>;
  transactionsByMonth: Array<{ month: string; earned: number; redeemed: number; count: number }>;
  topCustomers: Array<{ customerId: string; customerName: string; totalPoints: number; transactionCount: number }>;
  recentTransactions: CustomerPointsTransaction[];
}

export interface ICustomerPointsTransactionBackendService {
  getTransactions(shopId: string): Promise<CustomerPointsTransaction[]>;
  getTransactionById(id: string): Promise<CustomerPointsTransaction | null>;
  createTransaction(shopId: string, data: Omit<CustomerPointsTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerPointsTransaction>;
  updateTransaction(id: string, data: Partial<CustomerPointsTransaction>): Promise<CustomerPointsTransaction>;
  deleteTransaction(id: string): Promise<void>;
  getTransactionStats(shopId: string): Promise<CustomerPointsTransactionStats>;
  getTransactionsByCustomer(shopId: string, customerId: string): Promise<CustomerPointsTransaction[]>;
  getTransactionsByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<CustomerPointsTransaction[]>;
  getTransactionsByType(shopId: string, transactionType: string): Promise<CustomerPointsTransaction[]>;
}

export class CustomerPointsTransactionBackendService implements ICustomerPointsTransactionBackendService {
  private mockTransactions: CustomerPointsTransaction[] = [
    {
      id: '1',
      shopId: 'shop1',
      customerId: 'cust1',
      customerName: 'สมชาย ใจดี',
      customerPhone: '081-234-5678',
      transactionType: 'earned',
      points: 50,
      description: 'ได้รับแต้มจากการซื้อสินค้า',
      referenceType: 'purchase',
      referenceId: 'purchase_001',
      previousBalance: 100,
      newBalance: 150,
      employeeId: 'emp1',
      employeeName: 'พนักงาน A',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: '2',
      shopId: 'shop1',
      customerId: 'cust2',
      customerName: 'สมหญิง รักสวย',
      customerPhone: '082-345-6789',
      transactionType: 'redeemed',
      points: -30,
      description: 'ใช้แต้มแลกส่วนลด 10%',
      referenceType: 'reward',
      referenceId: 'reward_001',
      previousBalance: 80,
      newBalance: 50,
      employeeId: 'emp2',
      employeeName: 'พนักงาน B',
      createdAt: new Date('2024-01-14T14:20:00Z'),
      updatedAt: new Date('2024-01-14T14:20:00Z'),
    },
    {
      id: '3',
      shopId: 'shop1',
      customerId: 'cust3',
      customerName: 'วิชัย เก่งมาก',
      customerPhone: '083-456-7890',
      transactionType: 'earned',
      points: 75,
      description: 'ได้รับแต้มโบนัสจากโปรโมชั่น',
      referenceType: 'promotion',
      referenceId: 'promo_001',
      previousBalance: 200,
      newBalance: 275,
      employeeId: 'emp1',
      employeeName: 'พนักงาน A',
      createdAt: new Date('2024-01-13T16:45:00Z'),
      updatedAt: new Date('2024-01-13T16:45:00Z'),
    },
    {
      id: '4',
      shopId: 'shop1',
      customerId: 'cust1',
      customerName: 'สมชาย ใจดี',
      customerPhone: '081-234-5678',
      transactionType: 'redeemed',
      points: -100,
      description: 'ใช้แต้มแลกของรางวัล',
      referenceType: 'reward',
      referenceId: 'reward_002',
      previousBalance: 150,
      newBalance: 50,
      employeeId: 'emp3',
      employeeName: 'พนักงาน C',
      createdAt: new Date('2024-01-12T11:15:00Z'),
      updatedAt: new Date('2024-01-12T11:15:00Z'),
    },
    {
      id: '5',
      shopId: 'shop1',
      customerId: 'cust4',
      customerName: 'มาลี สวยงาม',
      customerPhone: '084-567-8901',
      transactionType: 'expired',
      points: -25,
      description: 'แต้มหมดอายุ (1 ปี)',
      referenceType: 'expiration',
      referenceId: 'exp_001',
      previousBalance: 125,
      newBalance: 100,
      createdAt: new Date('2024-01-11T00:00:00Z'),
      updatedAt: new Date('2024-01-11T00:00:00Z'),
    },
    {
      id: '6',
      shopId: 'shop1',
      customerId: 'cust5',
      customerName: 'สุชาติ ขยันทำงาน',
      customerPhone: '085-678-9012',
      transactionType: 'adjusted',
      points: 20,
      description: 'ปรับแต้มเพิ่ม (แก้ไขข้อผิดพลาด)',
      referenceType: 'manual',
      referenceId: 'adj_001',
      previousBalance: 60,
      newBalance: 80,
      employeeId: 'emp1',
      employeeName: 'พนักงาน A',
      createdAt: new Date('2024-01-10T13:30:00Z'),
      updatedAt: new Date('2024-01-10T13:30:00Z'),
    },
    {
      id: '7',
      shopId: 'shop1',
      customerId: 'cust2',
      customerName: 'สมหญิง รักสวย',
      customerPhone: '082-345-6789',
      transactionType: 'earned',
      points: 40,
      description: 'ได้รับแต้มจากการซื้อสินค้า',
      referenceType: 'purchase',
      referenceId: 'purchase_002',
      previousBalance: 50,
      newBalance: 90,
      employeeId: 'emp2',
      employeeName: 'พนักงาน B',
      createdAt: new Date('2024-01-09T15:45:00Z'),
      updatedAt: new Date('2024-01-09T15:45:00Z'),
    },
    {
      id: '8',
      shopId: 'shop1',
      customerId: 'cust6',
      customerName: 'อนุชา มีความสุข',
      customerPhone: '086-789-0123',
      transactionType: 'earned',
      points: 60,
      description: 'ได้รับแต้มจากการใช้บริการ',
      referenceType: 'purchase',
      referenceId: 'service_001',
      previousBalance: 0,
      newBalance: 60,
      employeeId: 'emp3',
      employeeName: 'พนักงาน C',
      createdAt: new Date('2024-01-08T12:20:00Z'),
      updatedAt: new Date('2024-01-08T12:20:00Z'),
    },
    {
      id: '9',
      shopId: 'shop1',
      customerId: 'cust3',
      customerName: 'วิชัย เก่งมาก',
      customerPhone: '083-456-7890',
      transactionType: 'redeemed',
      points: -50,
      description: 'ใช้แต้มแลกบริการฟรี',
      referenceType: 'reward',
      referenceId: 'reward_003',
      previousBalance: 275,
      newBalance: 225,
      employeeId: 'emp1',
      employeeName: 'พนักงาน A',
      createdAt: new Date('2024-01-07T09:10:00Z'),
      updatedAt: new Date('2024-01-07T09:10:00Z'),
    },
    {
      id: '10',
      shopId: 'shop1',
      customerId: 'cust7',
      customerName: 'ประยุทธ์ ชอบเที่ยว',
      customerPhone: '087-890-1234',
      transactionType: 'adjusted',
      points: -15,
      description: 'ปรับแต้มลด (แก้ไขข้อผิดพลาด)',
      referenceType: 'manual',
      referenceId: 'adj_002',
      previousBalance: 45,
      newBalance: 30,
      employeeId: 'emp2',
      employeeName: 'พนักงาน B',
      createdAt: new Date('2024-01-06T17:25:00Z'),
      updatedAt: new Date('2024-01-06T17:25:00Z'),
    },
  ];

  constructor(private readonly logger: Logger) { }

  async getTransactions(shopId: string): Promise<CustomerPointsTransaction[]> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transactions', { shopId });

    // Filter by shopId and sort by created date (newest first)
    const transactions = this.mockTransactions
      .filter(transaction => transaction.shopId === shopId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    this.logger.info('CustomerPointsTransactionBackendService: Retrieved transactions', {
      shopId,
      count: transactions.length
    });

    return transactions;
  }

  async getTransactionById(id: string): Promise<CustomerPointsTransaction | null> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transaction by ID', { id });

    const transaction = this.mockTransactions.find(transaction => transaction.id === id);

    if (!transaction) {
      this.logger.warn('CustomerPointsTransactionBackendService: Transaction not found', { id });
      return null;
    }

    return transaction;
  }

  async createTransaction(shopId: string, data: Omit<CustomerPointsTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerPointsTransaction> {
    this.logger.info('CustomerPointsTransactionBackendService: Creating transaction', { shopId, data });

    const newTransaction: CustomerPointsTransaction = {
      ...data,
      id: `transaction_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockTransactions.push(newTransaction);

    this.logger.info('CustomerPointsTransactionBackendService: Transaction created', {
      id: newTransaction.id,
      customerId: newTransaction.customerId,
      points: newTransaction.points
    });

    return newTransaction;
  }

  async updateTransaction(id: string, data: Partial<CustomerPointsTransaction>): Promise<CustomerPointsTransaction> {
    this.logger.info('CustomerPointsTransactionBackendService: Updating transaction', { id, data });

    const transactionIndex = this.mockTransactions.findIndex(transaction => transaction.id === id);

    if (transactionIndex === -1) {
      this.logger.error('CustomerPointsTransactionBackendService: Transaction not found for update', { id });
      throw new Error('Transaction not found');
    }

    const updatedTransaction = {
      ...this.mockTransactions[transactionIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.mockTransactions[transactionIndex] = updatedTransaction;

    this.logger.info('CustomerPointsTransactionBackendService: Transaction updated', {
      id: updatedTransaction.id,
      customerId: updatedTransaction.customerId
    });

    return updatedTransaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    this.logger.info('CustomerPointsTransactionBackendService: Deleting transaction', { id });

    const transactionIndex = this.mockTransactions.findIndex(transaction => transaction.id === id);

    if (transactionIndex === -1) {
      this.logger.error('CustomerPointsTransactionBackendService: Transaction not found for deletion', { id });
      throw new Error('Transaction not found');
    }

    const deletedTransaction = this.mockTransactions[transactionIndex];
    this.mockTransactions.splice(transactionIndex, 1);

    this.logger.info('CustomerPointsTransactionBackendService: Transaction deleted', {
      id,
      customerId: deletedTransaction.customerId
    });
  }

  async getTransactionStats(shopId: string): Promise<CustomerPointsTransactionStats> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transaction stats', { shopId });

    const transactions = await this.getTransactions(shopId);

    const totalTransactions = transactions.length;
    const totalPointsEarned = transactions
      .filter(t => t.transactionType === 'earned')
      .reduce((sum, t) => sum + t.points, 0);
    const totalPointsRedeemed = Math.abs(transactions
      .filter(t => t.transactionType === 'redeemed')
      .reduce((sum, t) => sum + t.points, 0));
    const totalPointsExpired = Math.abs(transactions
      .filter(t => t.transactionType === 'expired')
      .reduce((sum, t) => sum + t.points, 0));
    const totalPointsAdjusted = transactions
      .filter(t => t.transactionType === 'adjusted')
      .reduce((sum, t) => sum + t.points, 0);

    // Count transactions by type
    const transactionsByType: Record<string, number> = {};
    transactions.forEach(transaction => {
      transactionsByType[transaction.transactionType] = (transactionsByType[transaction.transactionType] || 0) + 1;
    });

    // Group transactions by month
    const monthlyData = new Map<string, { earned: number; redeemed: number; count: number }>();
    transactions.forEach(transaction => {
      const monthKey = transaction.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { earned: 0, redeemed: 0, count: 0 });
      }
      const data = monthlyData.get(monthKey)!;
      data.count++;
      if (transaction.transactionType === 'earned') {
        data.earned += transaction.points;
      } else if (transaction.transactionType === 'redeemed') {
        data.redeemed += Math.abs(transaction.points);
      }
    });

    const transactionsByMonth = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => b.month.localeCompare(a.month));

    // Get top customers by transaction activity
    const customerActivity = new Map<string, { customerName: string; totalPoints: number; transactionCount: number }>();
    transactions.forEach(transaction => {
      if (!customerActivity.has(transaction.customerId)) {
        customerActivity.set(transaction.customerId, {
          customerName: transaction.customerName || 'ไม่ระบุชื่อ',
          totalPoints: 0,
          transactionCount: 0
        });
      }
      const activity = customerActivity.get(transaction.customerId)!;
      activity.transactionCount++;
      if (transaction.transactionType === 'earned') {
        activity.totalPoints += transaction.points;
      }
    });

    const topCustomers = Array.from(customerActivity.entries())
      .map(([customerId, data]) => ({
        customerId,
        ...data
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);

    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);

    const stats = {
      totalTransactions,
      totalPointsEarned,
      totalPointsRedeemed,
      totalPointsExpired,
      totalPointsAdjusted,
      transactionsByType,
      transactionsByMonth,
      topCustomers,
      recentTransactions,
    };

    this.logger.info('CustomerPointsTransactionBackendService: Transaction stats calculated', {
      shopId,
      stats: {
        totalTransactions,
        totalPointsEarned,
        totalPointsRedeemed
      }
    });

    return stats;
  }

  async getTransactionsByCustomer(shopId: string, customerId: string): Promise<CustomerPointsTransaction[]> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transactions by customer', { shopId, customerId });

    const transactions = this.mockTransactions
      .filter(transaction => transaction.shopId === shopId && transaction.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    this.logger.info('CustomerPointsTransactionBackendService: Retrieved transactions by customer', {
      shopId,
      customerId,
      count: transactions.length
    });

    return transactions;
  }

  async getTransactionsByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<CustomerPointsTransaction[]> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transactions by date range', { shopId, startDate, endDate });

    const transactions = this.mockTransactions
      .filter(transaction =>
        transaction.shopId === shopId &&
        transaction.createdAt >= startDate &&
        transaction.createdAt <= endDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    this.logger.info('CustomerPointsTransactionBackendService: Retrieved transactions by date range', {
      shopId,
      count: transactions.length
    });

    return transactions;
  }

  async getTransactionsByType(shopId: string, transactionType: string): Promise<CustomerPointsTransaction[]> {
    this.logger.info('CustomerPointsTransactionBackendService: Getting transactions by type', { shopId, transactionType });

    const transactions = this.mockTransactions
      .filter(transaction => transaction.shopId === shopId && transaction.transactionType === transactionType)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    this.logger.info('CustomerPointsTransactionBackendService: Retrieved transactions by type', {
      shopId,
      transactionType,
      count: transactions.length
    });

    return transactions;
  }
}
