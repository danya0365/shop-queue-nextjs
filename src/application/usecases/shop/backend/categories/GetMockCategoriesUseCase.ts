import type { CategoriesDataDTO, CategoryDTO, CategoryStatsDTO } from '@/src/application/dtos/shop/backend/categories-dto';
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
          slug: 'haircut',
          name: 'ตัดผม',
          description: 'บริการตัดแต่งผม',
          icon: '✂️',
          color: '#3B82F6',
          shopsCount: 45,
          servicesCount: 120,
          isActive: true,
          sortOrder: 1,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          slug: 'beauty',
          name: 'ความงาม',
          description: 'บริการดูแลความงาม',
          icon: '💄',
          color: '#EC4899',
          shopsCount: 32,
          servicesCount: 89,
          isActive: true,
          sortOrder: 2,
          createdAt: '2023-02-20T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          slug: 'repair',
          name: 'ซ่อมมือถือ',
          description: 'บริการซ่อมแซมมือถือ',
          icon: '📱',
          color: '#10B981',
          shopsCount: 28,
          servicesCount: 67,
          isActive: true,
          sortOrder: 3,
          createdAt: '2023-03-10T00:00:00Z',
          updatedAt: '2024-01-13T00:00:00Z'
        },
        {
          id: '4',
          slug: 'restaurant',
          name: 'ร้านอาหาร',
          description: 'บริการสั่งอาหาร',
          icon: '🍽️',
          color: '#F59E0B',
          shopsCount: 15,
          servicesCount: 45,
          isActive: false,
          sortOrder: 4,
          createdAt: '2023-04-05T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z'
        },
        {
          id: '5',
          slug: 'spa',
          name: 'สปา',
          description: 'บริการนวดและสปา',
          icon: '🧘',
          color: '#8B5CF6',
          shopsCount: 22,
          servicesCount: 78,
          isActive: true,
          sortOrder: 5,
          createdAt: '2023-05-12T00:00:00Z',
          updatedAt: '2024-01-11T00:00:00Z'
        },
        {
          id: '6',
          slug: 'tailor',
          name: 'ซักรีด',
          description: 'บริการซักรีดเสื้อผ้า',
          icon: '👕',
          color: '#06B6D4',
          shopsCount: 18,
          servicesCount: 34,
          isActive: true,
          sortOrder: 6,
          createdAt: '2023-06-18T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        }
      ];

      const mockStats: CategoryStatsDTO = {
        totalCategories: 24,
        activeCategories: 18,
        totalShops: 160,
        totalServices: 433,
        mostPopularCategory: 'ตัดผม',
        leastPopularCategory: 'ร้านอาหาร'
      };

      const categoriesData: CategoriesDataDTO = {
        categories: mockCategories,
        stats: mockStats,
        totalCount: mockCategories.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetCategoriesUseCase: Successfully retrieved categories data');
      return categoriesData;
    } catch (error) {
      this.logger.error('GetCategoriesUseCase: Error getting categories data', error);
      throw error;
    }
  }
}
