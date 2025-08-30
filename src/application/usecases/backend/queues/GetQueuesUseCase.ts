
import type { QueueDTO, QueuesDataDTO, QueueStatsDTO } from '@/src/application/dtos/backend/QueuesDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetQueuesUseCase {
  execute(): Promise<QueuesDataDTO>;
}

export class GetQueuesUseCase implements IGetQueuesUseCase {
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
          customer_id: '1',
          customer_name: 'นาย สมชาย ใสใจ',
          customer_phone: '081-234-5678',
          shop_id: '1',
          shop_name: 'ร้านตัดผมสไตล์',
          queue_services: [{
            service_id: '1',
            service_name: 'ตัดผมชาย',
            quantity: 1,
            price: 100,
            total: 100
          }],
          queue_number: 15,
          status: 'waiting',
          priority: 'normal',
          estimated_wait_time: 30,
          notes: 'ต้องการตัดผมสั้น',
          created_at: '2024-01-15T09:30:00Z',
          updated_at: '2024-01-15T09:30:00Z'
        },
        {
          id: '2',
          customer_id: '2',
          customer_name: 'นางสาว มาลี ดีใจ',
          customer_phone: '082-345-6789',
          shop_id: '2',
          shop_name: 'คลินิกความงาม',
          queue_services: [{
            service_id: '2',
            service_name: 'ทำเล็บ',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queue_number: 8,
          status: 'in_progress',
          priority: 'high',
          estimated_wait_time: 45,
          actual_wait_time: 20,
          created_at: '2024-01-15T08:15:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          called_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          customer_id: '3',
          customer_name: 'นาย วิชัย เก่งดี',
          customer_phone: '083-456-7890',
          shop_id: '3',
          shop_name: 'ศูนย์ซ่อมมือถือ',
          queue_services: [{
            service_id: '3',
            service_name: 'เปลี่ยนจอมือถือ',
            quantity: 1,
            price: 150,
            total: 150
          }],
          queue_number: 3,
          status: 'completed',
          priority: 'urgent',
          estimated_wait_time: 60,
          actual_wait_time: 45,
          created_at: '2024-01-15T07:00:00Z',
          updated_at: '2024-01-15T08:30:00Z',
          called_at: '2024-01-15T07:45:00Z',
          completed_at: '2024-01-15T08:30:00Z'
        },
        {
          id: '4',
          customer_id: '4',
          customer_name: 'นางสาว สุดา จริงใจ',
          customer_phone: '084-567-8901',
          shop_id: '1',
          shop_name: 'ร้านตัดผมสไตล์',
          queue_services: [{
            service_id: '4',
            service_name: 'ย้อมผม',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queue_number: 12,
          status: 'cancelled',
          priority: 'normal',
          estimated_wait_time: 90,
          notes: 'ลูกค้ายกเลิกเอง',
          created_at: '2024-01-15T06:30:00Z',
          updated_at: '2024-01-15T09:00:00Z'
        },
        {
          id: '5',
          customer_id: '5',
          customer_name: 'นาย ประยุทธ มั่นใจ',
          customer_phone: '085-678-9012',
          shop_id: '2',
          shop_name: 'คลินิกความงาม',
          queue_services: [{
            service_id: '5',
            service_name: 'ทำหน้า',
            quantity: 1,
            price: 200,
            total: 200
          }],
          queue_number: 5,
          status: 'no_show',
          priority: 'normal',
          estimated_wait_time: 60,
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T09:30:00Z'
        }
      ];

      const mockStats: QueueStatsDTO = {
        total_queues: 156,
        waiting_queues: 23,
        in_progress_queues: 8,
        completed_today: 89,
        cancelled_today: 12,
        average_wait_time: 35
      };

      const queuesData: QueuesDataDTO = {
        queues: mockQueues,
        stats: mockStats,
        total_count: mockQueues.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetQueuesUseCase: Successfully retrieved queues data');
      return queuesData;
    } catch (error) {
      this.logger.error('GetQueuesUseCase: Error getting queues data', error);
      throw error;
    }
  }
}
