import type { ShopDTO, ShopsDataDTO, ShopStatsDTO } from '@/src/application/dtos/backend/ShopsDTO';
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
          category_id: '1',
          category_name: 'ตัดผม',
          owner_id: '1',
          owner_name: 'นาย สมชาย ใจดี',
          status: 'active',
          opening_hours: [
            { id: '1', shopId: '1', dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '1', dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '1', dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '1', dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '1', dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '1', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '1', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queue_count: 8,
          total_services: 15,
          rating: 4.5,
          total_reviews: 127,
          created_at: '2023-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'คลินิกความงาม',
          description: 'บริการดูแลผิวหน้า และความงาม',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          phone: '02-234-5678',
          email: 'info@beautyclinic.com',
          category_id: '2',
          category_name: 'ความงาม',
          owner_id: '2',
          owner_name: 'นางสาว มาลี สวยงาม',
          status: 'active',
          opening_hours: [
            { id: '1', shopId: '2', dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '2', dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '2', dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '2', dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '2', dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '2', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '2', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queue_count: 8,
          total_services: 15,
          rating: 4.5,
          total_reviews: 127,
          created_at: '2023-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'คลินิกความงาม',
          description: 'บริการดูแลผิวหน้า และความงาม',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          phone: '02-234-5678',
          email: 'info@beautyclinic.com',
          category_id: '2',
          category_name: 'ความงาม',
          owner_id: '2',
          owner_name: 'นางสาว มาลี สวยงาม',
          status: 'active',
          opening_hours: [
            { id: '1', shopId: '2', dayOfWeek: 'monday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '2', dayOfWeek: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '2', dayOfWeek: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '2', dayOfWeek: 'thursday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '2', dayOfWeek: 'friday', isOpen: true, openTime: '10:00', closeTime: '19:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '2', dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '2', dayOfWeek: 'sunday', isOpen: true, openTime: '10:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queue_count: 12,
          total_services: 25,
          rating: 4.8,
          total_reviews: 89,
          created_at: '2023-02-20T00:00:00Z',
          updated_at: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          name: 'ศูนย์ซ่อมมือถือ',
          description: 'ซ่อมมือถือ แท็บเล็ต อุปกรณ์ไอที',
          address: '789 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
          phone: '02-345-6789',
          email: 'repair@mobilefix.com',
          category_id: '3',
          category_name: 'ซ่อมมือถือ',
          owner_id: '3',
          owner_name: 'นาย วิชัย เก่งช่าง',
          status: 'pending',
          opening_hours: [
            { id: '1', shopId: '3', dayOfWeek: 'monday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', shopId: '3', dayOfWeek: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '3', shopId: '3', dayOfWeek: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '4', shopId: '3', dayOfWeek: 'thursday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '5', shopId: '3', dayOfWeek: 'friday', isOpen: true, openTime: '08:00', closeTime: '20:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '6', shopId: '3', dayOfWeek: 'saturday', isOpen: true, openTime: '09:00', closeTime: '18:00', breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() },
            { id: '7', shopId: '3', dayOfWeek: 'sunday', isOpen: false, openTime: null, closeTime: null, breakStart: null, breakEnd: null, createdAt: new Date(), updatedAt: new Date() }
          ],
          queue_count: 5,
          total_services: 12,
          rating: 4.2,
          total_reviews: 45,
          created_at: '2023-12-10T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ];

      const mockStats: ShopStatsDTO = {
        total_shops: 47,
        active_shops: 42,
        pending_approval: 3,
        new_this_month: 5
      };

      const shopsData: ShopsDataDTO = {
        shops: mockShops,
        stats: mockStats,
        total_count: mockShops.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetShopsUseCase: Successfully retrieved shops data');
      return shopsData;
    } catch (error) {
      this.logger.error('GetShopsUseCase: Error getting shops data', error);
      throw error;
    }
  }
}
