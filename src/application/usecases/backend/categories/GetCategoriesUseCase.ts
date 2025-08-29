import type { CategoriesDataDTO, CategoryDTO, CategoryStatsDTO } from '@/src/application/dtos/backend/CategoriesDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetCategoriesUseCase {
  execute(): Promise<CategoriesDataDTO>;
}

export class GetCategoriesUseCase implements IGetCategoriesUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<CategoriesDataDTO> {
    try {
      this.logger.info('GetCategoriesUseCase: Getting categories data');

      // Mock data - replace with actual repository calls
      const mockCategories: CategoryDTO[] = [
        {
          id: '1',
          name: 'ตัดผม',
          description: 'บริการตัดแต่งผม',
          icon: '✂️',
          color: '#3B82F6',
          shops_count: 45,
          services_count: 120,
          is_active: true,
          sort_order: 1,
          created_at: '2023-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'ความงาม',
          description: 'บริการดูแลความงาม',
          icon: '💄',
          color: '#EC4899',
          shops_count: 32,
          services_count: 89,
          is_active: true,
          sort_order: 2,
          created_at: '2023-02-20T00:00:00Z',
          updated_at: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          name: 'ซ่อมมือถือ',
          description: 'บริการซ่อมแซมมือถือ',
          icon: '📱',
          color: '#10B981',
          shops_count: 28,
          services_count: 67,
          is_active: true,
          sort_order: 3,
          created_at: '2023-03-10T00:00:00Z',
          updated_at: '2024-01-13T00:00:00Z'
        },
        {
          id: '4',
          name: 'ร้านอาหาร',
          description: 'บริการสั่งอาหาร',
          icon: '🍽️',
          color: '#F59E0B',
          shops_count: 15,
          services_count: 45,
          is_active: false,
          sort_order: 4,
          created_at: '2023-04-05T00:00:00Z',
          updated_at: '2024-01-12T00:00:00Z'
        },
        {
          id: '5',
          name: 'สปา',
          description: 'บริการนวดและสปา',
          icon: '🧘‍♀️',
          color: '#8B5CF6',
          shops_count: 22,
          services_count: 78,
          is_active: true,
          sort_order: 5,
          created_at: '2023-05-12T00:00:00Z',
          updated_at: '2024-01-11T00:00:00Z'
        },
        {
          id: '6',
          name: 'ซักรีด',
          description: 'บริการซักรีดเสื้อผ้า',
          icon: '👕',
          color: '#06B6D4',
          shops_count: 18,
          services_count: 34,
          is_active: true,
          sort_order: 6,
          created_at: '2023-06-18T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ];

      const mockStats: CategoryStatsDTO = {
        total_categories: 24,
        active_categories: 18,
        total_shops: 160,
        total_services: 433,
        most_popular_category: 'ตัดผม',
        least_popular_category: 'ร้านอาหาร'
      };

      const categoriesData: CategoriesDataDTO = {
        categories: mockCategories,
        stats: mockStats,
        total_count: mockCategories.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetCategoriesUseCase: Successfully retrieved categories data');
      return categoriesData;
    } catch (error) {
      this.logger.error('GetCategoriesUseCase: Error getting categories data', error);
      throw error;
    }
  }
}
