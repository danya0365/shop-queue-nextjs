import { EmployeeStatus, type EmployeeDTO, type EmployeesDataDTO, type EmployeeStatsDTO } from '@/src/application/dtos/backend/EmployeesDTO';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';

export class GetEmployeesUseCase implements IUseCase<void, EmployeesDataDTO> {
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
          employeeCode: 'EMP001',
          name: 'นาย วิชัย ขยันดี',
          email: 'wichai@shopqueue.com',
          phone: '081-111-2222',
          departmentId: '1',
          departmentName: 'customer_service',
          position: 'พนักงานบริการลูกค้า',
          shopId: '1',
          shopName: 'ร้านตัดผมสไตล์',
          status: EmployeeStatus.ACTIVE,
          hireDate: '2023-01-15T00:00:00Z',
          lastLogin: '2024-01-15T10:30:00Z',
          permissions: ['queue_management', 'customer_service'],
          salary: 25000,
          notes: 'พนักงานดีเด่น มีประสบการณ์ 5 ปี',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          employeeCode: 'EMP002',
          name: 'นางสาว สุดา ใจดี',
          email: 'suda@shopqueue.com',
          phone: '082-333-4444',
          departmentId: '2',
          departmentName: 'management',
          position: 'ผู้จัดการร้าน',
          shopId: '2',
          shopName: 'คลินิกความงาม',
          status: EmployeeStatus.ACTIVE,
          hireDate: '2022-08-20T00:00:00Z',
          lastLogin: '2024-01-15T09:15:00Z',
          permissions: ['full_access', 'employee_management', 'financial_reports'],
          salary: 45000,
          notes: 'ผู้จัดการที่มีความสามารถสูง',
          createdAt: '2022-08-20T00:00:00Z',
          updatedAt: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          employeeCode: 'EMP003',
          name: 'นาย ประยุทธ มั่นใจ',
          email: 'prayut@shopqueue.com',
          phone: '083-555-6666',
          departmentId: '3',
          departmentName: 'technical',
          position: 'ช่างเทคนิค',
          shopId: '3',
          shopName: 'ศูนย์ซ่อมมือถือ',
          status: EmployeeStatus.INACTIVE,
          hireDate: '2023-05-10T00:00:00Z',
          lastLogin: '2024-01-10T14:20:00Z',
          permissions: ['technical_support', 'device_repair'],
          salary: 30000,
          notes: 'ลาป่วยระยะยาว',
          createdAt: '2023-05-10T00:00:00Z',
          updatedAt: '2024-01-10T14:20:00Z'
        },
        {
          id: '4',
          employeeCode: 'EMP004',
          name: 'นางสาว มาลี สวยงาม',
          email: 'malee@shopqueue.com',
          phone: '084-777-8888',
          departmentId: '4',
          departmentName: 'sales',
          position: 'พนักงานขาย',
          shopId: '2',
          shopName: 'คลินิกความงาม',
          status: EmployeeStatus.ACTIVE,
          hireDate: '2023-11-01T00:00:00Z',
          lastLogin: '2024-01-15T08:45:00Z',
          permissions: ['sales_management', 'customer_service'],
          salary: 22000,
          notes: 'พนักงานใหม่ มีศักยภาพสูง',
          createdAt: '2023-11-01T00:00:00Z',
          updatedAt: '2024-01-15T08:45:00Z'
        },
        {
          id: '5',
          employeeCode: 'EMP005',
          name: 'นาย สมชาย รับผิดชอบ',
          email: 'somchai@shopqueue.com',
          phone: '085-999-0000',
          departmentId: '5',
          departmentName: 'management',
          position: 'ผู้ช่วยผู้จัดการ',
          shopId: '2',
          shopName: 'คลินิกความงาม',
          status: EmployeeStatus.SUSPENDED,
          hireDate: '2023-03-15T00:00:00Z',
          lastLogin: '2024-01-05T16:30:00Z',
          permissions: ['employee_management', 'queue_management'],
          salary: 35000,
          notes: 'ถูกระงับเนื่องจากการละเมิดกฎระเบียบ',
          createdAt: '2023-03-15T00:00:00Z',
          updatedAt: '2024-01-05T16:30:00Z'
        }
      ];

      const mockStats: EmployeeStatsDTO = {
        totalEmployees: 127,
        activeEmployees: 98,
        loggedInToday: 45,
        newEmployeesThisMonth: 8,
        byDepartment: {
          management: 12,
          customerService: 45,
          technical: 28,
          sales: 35,
          other: 7
        }
      };

      const employeesData: EmployeesDataDTO = {
        employees: mockEmployees,
        stats: mockStats,
        totalCount: mockEmployees.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetEmployeesUseCase: Successfully retrieved employees data');
      return employeesData;
    } catch (error) {
      this.logger.error('GetEmployeesUseCase: Error getting employees data', error);
      throw error;
    }
  }
}
