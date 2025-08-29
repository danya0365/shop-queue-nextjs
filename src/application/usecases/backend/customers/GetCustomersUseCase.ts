import type { CustomerDTO, CustomersDataDTO, CustomerStatsDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetCustomersUseCase {
  execute(): Promise<CustomersDataDTO>;
}

export class GetCustomersUseCase implements IGetCustomersUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<CustomersDataDTO> {
    try {
      this.logger.info('GetCustomersUseCase: Getting customers data');

      // Mock data - replace with actual repository calls
      const mockCustomers: CustomerDTO[] = [
        {
          id: '1',
          name: 'นาย สมชาย ใสใจ',
          phone: '081-234-5678',
          email: 'somchai@example.com',
          date_of_birth: '1985-05-15',
          gender: 'male',
          address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
          total_queues: 15,
          total_points: 250,
          membership_tier: 'gold',
          last_visit: '2024-01-15T10:30:00Z',
          favorite_shops: ['1', '3'],
          preferred_services: ['1', '2'],
          notes: 'ลูกค้าประจำ ชอบบริการตัดผม',
          is_active: true,
          created_at: '2023-06-15T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'นางสาว มาลี ดีใจ',
          phone: '082-345-6789',
          email: 'malee@example.com',
          date_of_birth: '1990-08-22',
          gender: 'female',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          total_queues: 8,
          total_points: 120,
          membership_tier: 'silver',
          last_visit: '2024-01-14T14:15:00Z',
          favorite_shops: ['2'],
          preferred_services: ['3', '4'],
          notes: 'ชอบบริการความงาม',
          is_active: true,
          created_at: '2023-08-20T00:00:00Z',
          updated_at: '2024-01-14T14:15:00Z'
        },
        {
          id: '3',
          name: 'นาย วิชัย เก่งดี',
          phone: '083-456-7890',
          email: 'wichai@example.com',
          date_of_birth: '1988-12-10',
          gender: 'male',
          total_queues: 25,
          total_points: 450,
          membership_tier: 'platinum',
          last_visit: '2024-01-15T09:00:00Z',
          favorite_shops: ['1', '2', '3'],
          preferred_services: ['1', '3', '5'],
          notes: 'ลูกค้า VIP ใช้บริการหลากหลาย',
          is_active: true,
          created_at: '2023-03-10T00:00:00Z',
          updated_at: '2024-01-15T09:00:00Z'
        },
        {
          id: '4',
          name: 'นางสาว สุดา จริงใจ',
          phone: '084-567-8901',
          email: 'suda@example.com',
          date_of_birth: '1992-02-28',
          gender: 'female',
          total_queues: 3,
          total_points: 45,
          membership_tier: 'bronze',
          last_visit: '2024-01-10T16:20:00Z',
          favorite_shops: ['2'],
          preferred_services: ['4'],
          is_active: true,
          created_at: '2023-12-05T00:00:00Z',
          updated_at: '2024-01-10T16:20:00Z'
        },
        {
          id: '5',
          name: 'นาย ประยุทธ มั่นใจ',
          phone: '085-678-9012',
          email: 'prayut@example.com',
          total_queues: 1,
          total_points: 10,
          membership_tier: 'regular',
          last_visit: '2024-01-08T11:45:00Z',
          favorite_shops: ['3'],
          preferred_services: ['6'],
          is_active: false,
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-08T11:45:00Z'
        }
      ];

      const mockStats: CustomerStatsDTO = {
        total_customers: 3420,
        new_customers_this_month: 156,
        active_customers_today: 89,
        gold_members: 245,
        silver_members: 678,
        bronze_members: 1234,
        regular_members: 1263
      };

      const customersData: CustomersDataDTO = {
        customers: mockCustomers,
        stats: mockStats,
        total_count: mockCustomers.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetCustomersUseCase: Successfully retrieved customers data');
      return customersData;
    } catch (error) {
      this.logger.error('GetCustomersUseCase: Error getting customers data', error);
      throw error;
    }
  }
}
