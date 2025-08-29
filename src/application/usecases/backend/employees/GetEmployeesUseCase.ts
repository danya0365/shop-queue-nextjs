import type { EmployeeDTO, EmployeesDataDTO, EmployeeStatsDTO } from '@/src/application/dtos/backend/EmployeesDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetEmployeesUseCase {
  execute(): Promise<EmployeesDataDTO>;
}

export class GetEmployeesUseCase implements IGetEmployeesUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<EmployeesDataDTO> {
    try {
      this.logger.info('GetEmployeesUseCase: Getting employees data');

      // Mock data - replace with actual repository calls
      const mockEmployees: EmployeeDTO[] = [
        {
          id: '1',
          name: 'นาย วิชัย ขยันดี',
          email: 'wichai@shopqueue.com',
          phone: '081-111-2222',
          department: 'customer_service',
          position: 'พนักงานบริการลูกค้า',
          shop_id: '1',
          shop_name: 'ร้านตัดผมสไตล์',
          status: 'active',
          hire_date: '2023-01-15T00:00:00Z',
          last_login: '2024-01-15T10:30:00Z',
          permissions: ['queue_management', 'customer_service'],
          salary: 25000,
          notes: 'พนักงานดีเด่น มีประสบการณ์ 5 ปี',
          created_at: '2023-01-15T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'นางสาว สุดา ใจดี',
          email: 'suda@shopqueue.com',
          phone: '082-333-4444',
          department: 'management',
          position: 'ผู้จัดการร้าน',
          shop_id: '2',
          shop_name: 'คลินิกความงาม',
          status: 'active',
          hire_date: '2022-08-20T00:00:00Z',
          last_login: '2024-01-15T09:15:00Z',
          permissions: ['full_access', 'employee_management', 'financial_reports'],
          salary: 45000,
          notes: 'ผู้จัดการที่มีความสามารถสูง',
          created_at: '2022-08-20T00:00:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          name: 'นาย ประยุทธ มั่นใจ',
          email: 'prayut@shopqueue.com',
          phone: '083-555-6666',
          department: 'technical',
          position: 'ช่างเทคนิค',
          shop_id: '3',
          shop_name: 'ศูนย์ซ่อมมือถือ',
          status: 'inactive',
          hire_date: '2023-05-10T00:00:00Z',
          last_login: '2024-01-10T14:20:00Z',
          permissions: ['technical_support', 'device_repair'],
          salary: 30000,
          notes: 'ลาป่วยระยะยาว',
          created_at: '2023-05-10T00:00:00Z',
          updated_at: '2024-01-10T14:20:00Z'
        },
        {
          id: '4',
          name: 'นางสาว มาลี สวยงาม',
          email: 'malee@shopqueue.com',
          phone: '084-777-8888',
          department: 'sales',
          position: 'พนักงานขาย',
          shop_id: '2',
          shop_name: 'คลินิกความงาม',
          status: 'active',
          hire_date: '2023-11-01T00:00:00Z',
          last_login: '2024-01-15T08:45:00Z',
          permissions: ['sales_management', 'customer_service'],
          salary: 22000,
          notes: 'พนักงานใหม่ มีศักยภาพสูง',
          created_at: '2023-11-01T00:00:00Z',
          updated_at: '2024-01-15T08:45:00Z'
        },
        {
          id: '5',
          name: 'นาย สมชาย รับผิดชอบ',
          email: 'somchai@shopqueue.com',
          phone: '085-999-0000',
          department: 'management',
          position: 'ผู้ช่วยผู้จัดการ',
          status: 'suspended',
          hire_date: '2023-03-15T00:00:00Z',
          last_login: '2024-01-05T16:30:00Z',
          permissions: ['employee_management', 'queue_management'],
          salary: 35000,
          notes: 'ถูกระงับเนื่องจากการละเมิดกฎระเบียบ',
          created_at: '2023-03-15T00:00:00Z',
          updated_at: '2024-01-05T16:30:00Z'
        }
      ];

      const mockStats: EmployeeStatsDTO = {
        total_employees: 127,
        active_employees: 98,
        logged_in_today: 45,
        new_employees_this_month: 8,
        by_department: {
          management: 12,
          customer_service: 45,
          technical: 28,
          sales: 35,
          other: 7
        }
      };

      const employeesData: EmployeesDataDTO = {
        employees: mockEmployees,
        stats: mockStats,
        total_count: mockEmployees.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetEmployeesUseCase: Successfully retrieved employees data');
      return employeesData;
    } catch (error) {
      this.logger.error('GetEmployeesUseCase: Error getting employees data', error);
      throw error;
    }
  }
}
