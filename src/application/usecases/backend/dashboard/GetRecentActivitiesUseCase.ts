import type { RecentActivityDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetRecentActivitiesUseCase {
  execute(): Promise<RecentActivityDTO[]>;
}

export class GetRecentActivitiesUseCase implements IGetRecentActivitiesUseCase {
  constructor(private readonly logger: Logger) { }

  async execute(): Promise<RecentActivityDTO[]> {
    try {
      this.logger.info('GetRecentActivitiesUseCase: Executing recent activities retrieval');

      // Mock data - replace with actual repository calls later
      const activities: RecentActivityDTO[] = [
        {
          id: '1',
          type: 'queue_created',
          title: 'คิวใหม่ถูกสร้าง',
          description: 'ลูกค้า นาย สมชาย ใสใจ สร้างคิวสำหรับบริการตัดผม',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          metadata: { customerName: 'นาย สมชาย ใสใจ', serviceName: 'ตัดผม' }
        },
        {
          id: '2',
          type: 'queue_completed',
          title: 'คิวเสร็จสิ้น',
          description: 'คิว #Q001 เสร็จสิ้นการให้บริการแล้ว',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          metadata: { queueNumber: 'Q001' }
        },
        {
          id: '3',
          type: 'customer_registered',
          title: 'ลูกค้าใหม่ลงทะเบียน',
          description: 'นางสาว มาลี ดีใจ ลงทะเบียนเป็นสมาชิกใหม่',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: { customerName: 'นางสาว มาลี ดีใจ' }
        },
        {
          id: '4',
          type: 'shop_created',
          title: 'ร้านใหม่เปิดให้บริการ',
          description: 'ร้าน "บิวตี้ เซ็นเตอร์" เปิดให้บริการแล้ว',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          metadata: { shopName: 'บิวตี้ เซ็นเตอร์' }
        },
        {
          id: '5',
          type: 'queue_created',
          title: 'คิวใหม่ถูกสร้าง',
          description: 'ลูกค้า นาง สุดา หวานใจ สร้างคิวสำหรับบริการทำเล็บ',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          metadata: { customerName: 'นาง สุดา หวานใจ', serviceName: 'ทำเล็บ' }
        }
      ];

      this.logger.info('GetRecentActivitiesUseCase: Successfully retrieved recent activities');
      return activities;
    } catch (error) {
      this.logger.error('GetRecentActivitiesUseCase: Error retrieving recent activities', error);
      throw error;
    }
  }
}
