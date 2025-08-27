import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface PaymentQueue {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  services: PaymentItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'qr' | 'transfer';
  paidAmount: number;
  remainingAmount: number;
  completedAt?: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

// Define ViewModel interface
export interface EmployeePaymentViewModel {
  readyQueues: PaymentQueue[];
  completedPayments: PaymentQueue[];
  paymentMethods: PaymentMethod[];
  totalSales: number;
  employeeName: string;
}

// Main Presenter class
export class EmployeePaymentPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<EmployeePaymentViewModel> {
    try {
      this.logger.info('EmployeePaymentPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const readyQueues = this.getReadyQueues();
      const completedPayments = this.getCompletedPayments();
      const paymentMethods = this.getPaymentMethods();
      
      return {
        readyQueues,
        completedPayments,
        paymentMethods,
        totalSales: 15420,
        employeeName: 'สมชาย ใจดี',
      };
    } catch (error) {
      this.logger.error('EmployeePaymentPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getReadyQueues(): PaymentQueue[] {
    return [
      {
        id: '1',
        queueNumber: 'A016',
        customerName: 'สมหญิง รักดี',
        customerPhone: '082-345-6789',
        services: [
          { id: '1', name: 'กาแฟลาเต้', price: 85, quantity: 1, total: 85 },
          { id: '2', name: 'เค้กช็อกโกแลต', price: 120, quantity: 1, total: 120 },
        ],
        subtotal: 205,
        discount: 0,
        tax: 14.35,
        total: 219.35,
        paymentStatus: 'unpaid',
        paidAmount: 0,
        remainingAmount: 219.35,
      },
      {
        id: '2',
        queueNumber: 'A017',
        customerName: 'สมศรี มีสุข',
        customerPhone: '083-456-7890',
        services: [
          { id: '3', name: 'เซ็ตอาหารเช้า', price: 150, quantity: 1, total: 150 },
        ],
        subtotal: 150,
        discount: 15,
        tax: 9.45,
        total: 144.45,
        paymentStatus: 'unpaid',
        paidAmount: 0,
        remainingAmount: 144.45,
      },
    ];
  }

  private getCompletedPayments(): PaymentQueue[] {
    return [
      {
        id: '3',
        queueNumber: 'A014',
        customerName: 'สมปอง ดีใจ',
        customerPhone: '084-567-8901',
        services: [
          { id: '4', name: 'กาแฟอเมริกาโน่', price: 65, quantity: 2, total: 130 },
        ],
        subtotal: 130,
        discount: 0,
        tax: 9.10,
        total: 139.10,
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        paidAmount: 139.10,
        remainingAmount: 0,
        completedAt: '10:25',
      },
    ];
  }

  private getPaymentMethods(): PaymentMethod[] {
    return [
      { id: 'cash', name: 'เงินสด', icon: '💵', available: true },
      { id: 'card', name: 'บัตรเครดิต', icon: '💳', available: true },
      { id: 'qr', name: 'QR Code', icon: '📱', available: true },
      { id: 'transfer', name: 'โอนเงิน', icon: '🏦', available: false },
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'ชำระเงิน - พนักงาน | Shop Queue',
      description: 'จัดการการชำระเงินและออกใบเสร็จสำหรับลูกค้า',
    };
  }
}

// Factory class
export class EmployeePaymentPresenterFactory {
  static async create(): Promise<EmployeePaymentPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new EmployeePaymentPresenter(logger);
  }
}
