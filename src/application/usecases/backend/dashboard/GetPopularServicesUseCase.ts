import type { PopularServicesDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetPopularServicesUseCase {
  execute(): Promise<PopularServicesDTO[]>;
}

export class GetPopularServicesUseCase implements IGetPopularServicesUseCase {
  constructor(private readonly logger: Logger) { }

  async execute(): Promise<PopularServicesDTO[]> {
    try {
      this.logger.info('GetPopularServicesUseCase: Executing popular services retrieval');

      // Mock data - replace with actual repository calls later
      const services: PopularServicesDTO[] = [
        {
          id: '1',
          name: 'ตัดผมชาย',
          queueCount: 45,
          revenue: 22500,
          category: 'ทำผม'
        },
        {
          id: '2',
          name: 'ทำเล็บ',
          queueCount: 38,
          revenue: 19000,
          category: 'ความงาม'
        },
        {
          id: '3',
          name: 'สปาผ่อนคลาย',
          queueCount: 25,
          revenue: 37500,
          category: 'สปา'
        },
        {
          id: '4',
          name: 'ย้อมสีผม',
          queueCount: 22,
          revenue: 33000,
          category: 'ทำผม'
        },
        {
          id: '5',
          name: 'นวดแผนไทย',
          queueCount: 18,
          revenue: 18000,
          category: 'นวด'
        }
      ];

      this.logger.info('GetPopularServicesUseCase: Successfully retrieved popular services');
      return services;
    } catch (error) {
      this.logger.error('GetPopularServicesUseCase: Error retrieving popular services', error);
      throw error;
    }
  }
}
