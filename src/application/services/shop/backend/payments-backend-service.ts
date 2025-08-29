import type { Logger } from '@/src/domain/interfaces/logger';

// Payment interfaces
export interface Payment {
  id: string;
  queueId: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod: 'cash' | 'card' | 'qr' | 'transfer' | null;
  processedByEmployeeId: string | null;
  paymentDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Additional computed fields
  customerName?: string;
  queueNumber?: string;
  employeeName?: string;
  services?: string[];
}

export interface CreatePaymentData {
  queueId: string;
  totalAmount: number;
  paymentMethod?: 'cash' | 'card' | 'qr' | 'transfer';
  processedByEmployeeId?: string;
}

export interface UpdatePaymentData {
  paidAmount?: number;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'qr' | 'transfer';
  processedByEmployeeId?: string;
}

export interface IPaymentsBackendService {
  getPayments(shopId: string): Promise<Payment[]>;
  getPaymentById(shopId: string, paymentId: string): Promise<Payment | null>;
  createPayment(shopId: string, data: CreatePaymentData): Promise<Payment>;
  updatePayment(shopId: string, paymentId: string, data: UpdatePaymentData): Promise<Payment>;
  processPayment(shopId: string, paymentId: string, amount: number, method: 'cash' | 'card' | 'qr' | 'transfer', employeeId: string): Promise<Payment>;
  getPaymentsByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<Payment[]>;
}

export class PaymentsBackendService implements IPaymentsBackendService {
  constructor(private readonly logger: Logger) { }

  async getPayments(shopId: string): Promise<Payment[]> {
    this.logger.info('PaymentsBackendService: Getting payments for shop', { shopId });

    // Mock data - replace with actual repository call
    const mockPayments: Payment[] = [
      {
        id: '1',
        queueId: 'queue-1',
        totalAmount: 350,
        paidAmount: 350,
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        processedByEmployeeId: 'emp-1',
        paymentDate: new Date('2024-08-28T10:30:00'),
        createdAt: new Date('2024-08-28T10:00:00'),
        updatedAt: new Date('2024-08-28T10:30:00'),
        customerName: 'สมชาย ใจดี',
        queueNumber: 'A001',
        employeeName: 'นางสาวสุดา',
        services: ['ตัดผมชาย', 'สระผม'],
      },
      {
        id: '2',
        queueId: 'queue-2',
        totalAmount: 800,
        paidAmount: 400,
        paymentStatus: 'partial',
        paymentMethod: 'card',
        processedByEmployeeId: 'emp-2',
        paymentDate: new Date('2024-08-28T11:15:00'),
        createdAt: new Date('2024-08-28T11:00:00'),
        updatedAt: new Date('2024-08-28T11:15:00'),
        customerName: 'สมหญิง รักสวย',
        queueNumber: 'A002',
        employeeName: 'นายสมศักดิ์',
        services: ['ย้อมสี'],
      },
      {
        id: '3',
        queueId: 'queue-3',
        totalAmount: 600,
        paidAmount: 0,
        paymentStatus: 'unpaid',
        paymentMethod: null,
        processedByEmployeeId: null,
        paymentDate: null,
        createdAt: new Date('2024-08-28T12:00:00'),
        updatedAt: new Date('2024-08-28T12:00:00'),
        customerName: 'วิชัย เก่งมาก',
        queueNumber: 'A003',
        employeeName: undefined,
        services: ['ดัดผม'],
      },
      {
        id: '4',
        queueId: 'queue-4',
        totalAmount: 200,
        paidAmount: 200,
        paymentStatus: 'paid',
        paymentMethod: 'qr',
        processedByEmployeeId: 'emp-1',
        paymentDate: new Date('2024-08-28T13:45:00'),
        createdAt: new Date('2024-08-28T13:30:00'),
        updatedAt: new Date('2024-08-28T13:45:00'),
        customerName: 'นิดา สวยงาม',
        queueNumber: 'A004',
        employeeName: 'นางสาวสุดา',
        services: ['ตัดผมหญิง'],
      },
      {
        id: '5',
        queueId: 'queue-5',
        totalAmount: 450,
        paidAmount: 450,
        paymentStatus: 'paid',
        paymentMethod: 'transfer',
        processedByEmployeeId: 'emp-3',
        paymentDate: new Date('2024-08-28T14:20:00'),
        createdAt: new Date('2024-08-28T14:00:00'),
        updatedAt: new Date('2024-08-28T14:20:00'),
        customerName: 'ประยุทธ์ มั่นใจ',
        queueNumber: 'A005',
        employeeName: 'นายวิชัย',
        services: ['ตัดผมชาย', 'สระผม', 'นวดศีรษะ'],
      },
    ];

    return mockPayments;
  }

  async getPaymentById(shopId: string, paymentId: string): Promise<Payment | null> {
    this.logger.info('PaymentsBackendService: Getting payment by ID', { shopId, paymentId });

    const payments = await this.getPayments(shopId);
    return payments.find(payment => payment.id === paymentId) || null;
  }

  async createPayment(shopId: string, data: CreatePaymentData): Promise<Payment> {
    this.logger.info('PaymentsBackendService: Creating payment', { shopId, data });

    // Mock implementation - replace with actual repository call
    const newPayment: Payment = {
      id: Date.now().toString(),
      queueId: data.queueId,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      paymentMethod: data.paymentMethod || null,
      processedByEmployeeId: data.processedByEmployeeId || null,
      paymentDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newPayment;
  }

  async updatePayment(shopId: string, paymentId: string, data: UpdatePaymentData): Promise<Payment> {
    this.logger.info('PaymentsBackendService: Updating payment', { shopId, paymentId, data });

    const existingPayment = await this.getPaymentById(shopId, paymentId);
    if (!existingPayment) {
      throw new Error('Payment not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedPayment: Payment = {
      ...existingPayment,
      ...data,
      updatedAt: new Date(),
    };

    return updatedPayment;
  }

  async processPayment(
    shopId: string,
    paymentId: string,
    amount: number,
    method: 'cash' | 'card' | 'qr' | 'transfer',
    employeeId: string
  ): Promise<Payment> {
    this.logger.info('PaymentsBackendService: Processing payment', { shopId, paymentId, amount, method, employeeId });

    const existingPayment = await this.getPaymentById(shopId, paymentId);
    if (!existingPayment) {
      throw new Error('Payment not found');
    }

    const newPaidAmount = existingPayment.paidAmount + amount;
    let paymentStatus: 'unpaid' | 'partial' | 'paid' = 'partial';

    if (newPaidAmount >= existingPayment.totalAmount) {
      paymentStatus = 'paid';
    } else if (newPaidAmount <= 0) {
      paymentStatus = 'unpaid';
    }

    // Mock implementation - replace with actual repository call
    const updatedPayment: Payment = {
      ...existingPayment,
      paidAmount: newPaidAmount,
      paymentStatus,
      paymentMethod: method,
      processedByEmployeeId: employeeId,
      paymentDate: new Date(),
      updatedAt: new Date(),
    };

    return updatedPayment;
  }

  async getPaymentsByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<Payment[]> {
    this.logger.info('PaymentsBackendService: Getting payments by date range', { shopId, startDate, endDate });

    const payments = await this.getPayments(shopId);
    return payments.filter(payment => {
      const paymentDate = payment.paymentDate || payment.createdAt;
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }
}
