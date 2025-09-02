
import type { QueueDTO, QueuesDataDTO, QueueStatsDTO } from '@/src/application/dtos/backend/queues-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetQueuesUseCase {
  execute(): Promise<QueuesDataDTO>;
}

export class GetMockQueuesUseCase implements IGetQueuesUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<QueuesDataDTO> {
    try {
      this.logger.info('GetQueuesUseCase: Getting queues data');

      // Mock data - replace with actual repository calls
      const mockQueues: QueueDTO[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'นาย สมชาย ใสใจ',
          customerPhone: '081-234-5678',
          shopId: '1',
          shopName: 'ร้านตัดผมสไตล์',
          queueServices: [{
            serviceId: '1',
            serviceName: 'ตัดผมชาย',
            quantity: 1,
            price: 100,
            total: 100
          }],
          queueNumber: 15,
          status: 'waiting',
          priority: 'normal',
          estimatedWaitTime: 30,
          notes: 'ต้องการตัดผมสั้น',
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-01-15T09:30:00Z'
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'นางสาว มาลี ดีใจ',
          customerPhone: '082-345-6789',
          shopId: '2',
          shopName: 'คลินิกความงาม',
          queueServices: [{
            serviceId: '2',
            serviceName: 'ทำเล็บ',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queueNumber: 8,
          status: 'in_progress',
          priority: 'high',
          estimatedWaitTime: 45,
          actualWaitTime: 20,
          createdAt: '2024-01-15T08:15:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          calledAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'นาย วิชัย เก่งดี',
          customerPhone: '083-456-7890',
          shopId: '3',
          shopName: 'ศูนย์ซ่อมมือถือ',
          queueServices: [{
            serviceId: '3',
            serviceName: 'เปลี่ยนจอมือถือ',
            quantity: 1,
            price: 150,
            total: 150
          }],
          queueNumber: 3,
          status: 'completed',
          priority: 'urgent',
          estimatedWaitTime: 60,
          actualWaitTime: 45,
          createdAt: '2024-01-15T07:00:00Z',
          updatedAt: '2024-01-15T08:30:00Z',
          calledAt: '2024-01-15T07:45:00Z',
          completedAt: '2024-01-15T08:30:00Z'
        },
        {
          id: '4',
          customerId: '4',
          customerName: 'นางสาว สุดา จริงใจ',
          customerPhone: '084-567-8901',
          shopId: '1',
          shopName: 'ร้านตัดผมสไตล์',
          queueServices: [{
            serviceId: '4',
            serviceName: 'ย้อมผม',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queueNumber: 12,
          status: 'cancelled',
          priority: 'normal',
          estimatedWaitTime: 90,
          notes: 'ลูกค้ายกเลิกเอง',
          createdAt: '2024-01-15T06:30:00Z',
          updatedAt: '2024-01-15T09:00:00Z'
        },
        {
          id: '5',
          customerId: '5',
          customerName: 'นาย ประยุทธ มั่นใจ',
          customerPhone: '085-678-9012',
          shopId: '2',
          shopName: 'คลินิกความงาม',
          queueServices: [{
            serviceId: '5',
            serviceName: 'ทำหน้า',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queueNumber: 5,
          status: 'no_show',
          priority: 'normal',
          estimatedWaitTime: 60,
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-15T09:30:00Z'
        }
      ];

      const mockStats: QueueStatsDTO = {
        totalQueues: 156,
        waitingQueues: 23,
        inProgressQueues: 8,
        completedToday: 89,
        cancelledToday: 12,
        averageWaitTime: 35
      };

      const queuesData: QueuesDataDTO = {
        queues: mockQueues,
        stats: mockStats,
        totalCount: mockQueues.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetQueuesUseCase: Successfully retrieved queues data');
      return queuesData;
    } catch (error) {
      this.logger.error('GetQueuesUseCase: Error getting queues data', error);
      throw error;
    }
  }
}
