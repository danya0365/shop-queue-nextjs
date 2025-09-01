import type { PaymentsDataDTO, PaymentDTO, PaymentStatsDTO } from '@/src/application/dtos/backend/payments-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetPaymentsUseCase {
  execute(): Promise<PaymentsDataDTO>;
}

export class GetPaymentsUseCase implements IGetPaymentsUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<PaymentsDataDTO> {
    try {
      this.logger.info('GetPaymentsUseCase: Getting payments data');

      // Mock data - replace with actual repository calls
      const mockPayments: PaymentDTO[] = [
        {
          id: '1',
          queueId: 'queue-001',
          queueNumber: 'Q001',
          customerName: 'สมชาย ใจดี',
          totalAmount: 350,
          paidAmount: 350,
          paymentMethod: 'cash',
          paymentStatus: 'paid',
          paymentDate: '2024-01-15T14:30:00Z',
          processedByEmployeeId: 'emp-001',
          processedByEmployeeName: 'พนักงาน A',
          shopId: 'shop-001',
          shopName: 'ร้านตัดผม ABC',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          queueId: 'queue-002',
          queueNumber: 'Q002',
          customerName: 'สมหญิง รักงาม',
          totalAmount: 1200,
          paidAmount: 600,
          paymentMethod: 'card',
          paymentStatus: 'partial',
          paymentDate: '2024-01-15T15:45:00Z',
          processedByEmployeeId: 'emp-002',
          processedByEmployeeName: 'พนักงาน B',
          shopId: 'shop-002',
          shopName: 'ร้านความงาม XYZ',
          createdAt: '2024-01-15T11:30:00Z',
          updatedAt: '2024-01-15T15:45:00Z'
        },
        {
          id: '3',
          queueId: 'queue-003',
          queueNumber: 'Q003',
          customerName: 'วิชัย มีสุข',
          totalAmount: 800,
          paidAmount: null,
          paymentMethod: null,
          paymentStatus: 'unpaid',
          paymentDate: null,
          processedByEmployeeId: null,
          processedByEmployeeName: null,
          shopId: 'shop-001',
          shopName: 'ร้านตัดผม ABC',
          createdAt: '2024-01-15T12:00:00Z',
          updatedAt: null
        },
        {
          id: '4',
          queueId: 'queue-004',
          queueNumber: 'Q004',
          customerName: 'นิรมล สวยงาม',
          totalAmount: 2500,
          paidAmount: 2500,
          paymentMethod: 'qr',
          paymentStatus: 'paid',
          paymentDate: '2024-01-15T16:20:00Z',
          processedByEmployeeId: 'emp-003',
          processedByEmployeeName: 'พนักงาน C',
          shopId: 'shop-003',
          shopName: 'สปา DEF',
          createdAt: '2024-01-15T13:15:00Z',
          updatedAt: '2024-01-15T16:20:00Z'
        },
        {
          id: '5',
          queueId: 'queue-005',
          queueNumber: 'Q005',
          customerName: 'ประยุทธ์ ซื่อสัตย์',
          totalAmount: 450,
          paidAmount: 450,
          paymentMethod: 'transfer',
          paymentStatus: 'paid',
          paymentDate: '2024-01-15T17:10:00Z',
          processedByEmployeeId: 'emp-001',
          processedByEmployeeName: 'พนักงาน A',
          shopId: 'shop-004',
          shopName: 'ร้านซ่อมมือถือ GHI',
          createdAt: '2024-01-15T14:00:00Z',
          updatedAt: '2024-01-15T17:10:00Z'
        },
        {
          id: '6',
          queueId: 'queue-006',
          queueNumber: 'Q006',
          customerName: 'สุภาพ ใสใจ',
          totalAmount: 180,
          paidAmount: 100,
          paymentMethod: 'cash',
          paymentStatus: 'partial',
          paymentDate: '2024-01-15T18:00:00Z',
          processedByEmployeeId: 'emp-004',
          processedByEmployeeName: 'พนักงาน D',
          shopId: 'shop-005',
          shopName: 'ร้านซักรีด JKL',
          createdAt: '2024-01-15T15:30:00Z',
          updatedAt: '2024-01-15T18:00:00Z'
        }
      ];

      const mockStats: PaymentStatsDTO = {
        totalPayments: 156,
        totalRevenue: 125400,
        paidPayments: 98,
        unpaidPayments: 32,
        partialPayments: 26,
        todayRevenue: 4480,
        averagePaymentAmount: 804,
        mostUsedPaymentMethod: 'cash'
      };

      const paymentsData: PaymentsDataDTO = {
        payments: mockPayments,
        stats: mockStats,
        totalCount: mockPayments.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetPaymentsUseCase: Successfully retrieved payments data');
      return paymentsData;
    } catch (error) {
      this.logger.error('GetPaymentsUseCase: Error getting payments data', error);
      throw error;
    }
  }
}
