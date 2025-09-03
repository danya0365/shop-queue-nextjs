import type { ShopDTO, ShopsDataDTO, ShopStatsDTO } from '@/src/application/dtos/backend/shops-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetShopsUseCase {
  execute(): Promise<ShopsDataDTO>;
}

export class GetShopsUseCase implements IGetShopsUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<ShopsDataDTO> {
    try {
      this.logger.info('GetShopsUseCase: Getting shops data');

      // Mock data - replace with actual repository calls
      const mockShops: ShopDTO[] = [
        {
          id: '1',
          name: 'ร้านตัดผมสไตล์',
          description: 'ร้านตัดผมชาย-หญิง บริการครบครัน',
          address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
          phone: '02-123-4567',
          email: 'contact@stylehair.com',
          categories: [
            {
              id: '1',
              name: 'ตัดผม',
              description: 'ตัดผม',
              icon: 'haircut',
              color: '#FF0000',
              shopsCount: 1,
              servicesCount: 1,
              isActive: true,
              sortOrder: 1,
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2024-01-15T00:00:00Z'
            }
          ],
          ownerId: '1',
          ownerName: 'นาย สมชาย ใจดี',
          status: 'active',
          openingHours: [
            { id: '1', shopId: '1', dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '1', dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '1', dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '1', dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '1', dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '1', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '1', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queueCount: 8,
          totalServices: 15,
          rating: 4.5,
          totalReviews: 127,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'คลินิกความงาม',
          description: 'บริการดูแลผิวหน้า และความงาม',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          phone: '02-234-5678',
          email: 'info@beautyclinic.com',
          categories: [
            {
              id: '2',
              name: 'ความงาม',
              description: 'ความงาม',
              icon: 'beauty',
              color: '#FF0000',
              shopsCount: 1,
              servicesCount: 1,
              isActive: true,
              sortOrder: 1,
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2024-01-15T00:00:00Z'
            }
          ],
          ownerId: '2',
          ownerName: 'นางสาว มาลี สวยงาม',
          status: 'active',
          openingHours: [
            { id: '1', shopId: '2', dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '2', dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '2', dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '2', dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '2', dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '2', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '2', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queueCount: 8,
          totalServices: 15,
          rating: 4.5,
          totalReviews: 127,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'คลินิกความงาม',
          description: 'บริการดูแลผิวหน้า และความงาม',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          phone: '02-234-5678',
          email: 'info@beautyclinic.com',
          categories: [
            {
              id: '2',
              name: 'ความงาม',
              description: 'ความงาม',
              icon: 'beauty',
              color: '#FF0000',
              shopsCount: 1,
              servicesCount: 1,
              isActive: true,
              sortOrder: 1,
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2024-01-15T00:00:00Z'
            }
          ],
          ownerId: '2',
          ownerName: 'นางสาว มาลี สวยงาม',
          status: 'active',
          openingHours: [
            { id: '1', shopId: '2', dayOfWeek: 'monday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '2', dayOfWeek: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '2', dayOfWeek: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '2', dayOfWeek: 'thursday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '2', dayOfWeek: 'friday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '2', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '2', dayOfWeek: 'sunday', isOpen: true, openTime: '10:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queueCount: 12,
          totalServices: 25,
          rating: 4.8,
          totalReviews: 89,
          createdAt: '2023-02-20T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          name: 'ศูนย์ซ่อมมือถือ',
          description: 'ซ่อมมือถือ แท็บเล็ต อุปกรณ์ไอที',
          address: '789 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
          phone: '02-345-6789',
          email: 'repair@mobilefix.com',
          categories: [
            {
              id: '3',
              name: 'ซ่อมมือถือ',
              description: 'ซ่อมมือถือ',
              icon: 'repair',
              color: '#FF0000',
              shopsCount: 1,
              servicesCount: 1,
              isActive: true,
              sortOrder: 1,
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2024-01-15T00:00:00Z'
            }
          ],
          ownerId: '3',
          ownerName: 'นาย วิชัย เก่งช่าง',
          status: 'pending',
          openingHours: [
            { id: '1', shopId: '3', dayOfWeek: 'monday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '3', dayOfWeek: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '3', dayOfWeek: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '3', dayOfWeek: 'thursday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '3', dayOfWeek: 'friday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '3', dayOfWeek: 'saturday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '3', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queueCount: 5,
          totalServices: 12,
          rating: 4.2,
          totalReviews: 45,
          createdAt: '2023-12-10T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        }
      ];

      const mockStats: ShopStatsDTO = {
        totalShops: 47,
        activeShops: 42,
        pendingApproval: 3,
        newThisMonth: 5
      };

      const shopsData: ShopsDataDTO = {
        shops: mockShops,
        stats: mockStats,
        totalCount: mockShops.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetShopsUseCase: Successfully retrieved shops data');
      return shopsData;
    } catch (error) {
      this.logger.error('GetShopsUseCase: Error getting shops data', error);
      throw error;
    }
  }
}
