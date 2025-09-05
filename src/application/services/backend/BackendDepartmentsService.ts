import type { CreateDepartmentDTO, DepartmentDTO, DepartmentsDataDTO, DepartmentStatsDTO, UpdateDepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import { EmployeeDTO, EmployeeStatus } from '../../dtos/backend/employees-dto';

export class BackendDepartmentsService {
  // Mock data for departments
  private mockDepartments: DepartmentDTO[] = [
    {
      id: '1',
      shopId: 'shop-1',
      name: 'การขาย',
      slug: 'sales',
      description: 'แผนกการขายและบริการลูกค้า',
      employeeCount: 8,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      shopId: 'shop-1',
      name: 'การตลาด',
      slug: 'marketing',
      description: 'แผนกการตลาดและประชาสัมพันธ์',
      employeeCount: 5,
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z'
    },
    {
      id: '3',
      shopId: 'shop-1',
      name: 'เทคโนโลยีสารสนเทศ',
      slug: 'it',
      description: 'แผนกเทคโนโลยีสารสนเทศและระบบคอมพิวเตอร์',
      employeeCount: 12,
      createdAt: '2024-01-17T10:00:00Z',
      updatedAt: '2024-01-17T10:00:00Z'
    },
    {
      id: '4',
      shopId: 'shop-1',
      name: 'ทรัพยากรบุคคล',
      slug: 'hr',
      description: 'แผนกทรัพยากรบุคคลและการพัฒนาบุคลากร',
      employeeCount: 6,
      createdAt: '2024-01-18T11:00:00Z',
      updatedAt: '2024-01-18T11:00:00Z'
    },
    {
      id: '5',
      shopId: 'shop-1',
      name: 'การเงินและบัญชี',
      slug: 'finance',
      description: 'แผนกการเงิน บัญชี และการวางแผนทางการเงิน',
      employeeCount: 7,
      createdAt: '2024-01-19T12:00:00Z',
      updatedAt: '2024-01-19T12:00:00Z'
    },
    {
      id: '6',
      shopId: 'shop-1',
      name: 'การผลิต',
      slug: 'production',
      description: 'แผนกการผลิตและควบคุมคุณภาพ',
      employeeCount: 15,
      createdAt: '2024-01-20T13:00:00Z',
      updatedAt: '2024-01-20T13:00:00Z'
    },
    {
      id: '7',
      shopId: 'shop-1',
      name: 'โลจิสติกส์',
      slug: 'logistics',
      description: 'แผนกโลจิสติกส์และการจัดส่ง',
      employeeCount: 9,
      createdAt: '2024-01-21T14:00:00Z',
      updatedAt: '2024-01-21T14:00:00Z'
    },
    {
      id: '8',
      shopId: 'shop-1',
      name: 'วิจัยและพัฒนา',
      slug: 'rd',
      description: 'แผนกวิจัยและพัฒนาผลิตภัณฑ์',
      employeeCount: 4,
      createdAt: '2024-01-22T15:00:00Z',
      updatedAt: '2024-01-22T15:00:00Z'
    }
  ];

  // Mock employees data
  private mockEmployees: EmployeeDTO[] = [
    {
      id: 'emp-1',
      shopId: 'shop-1',
      employeeCode: 'EMP001',
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      phone: '081-234-5678',
      position: 'ผู้จัดการฝ่ายขาย',
      departmentId: '1',
      departmentName: 'การขาย',
      salary: 45000,
      hireDate: '2023-06-15',
      status: EmployeeStatus.ACTIVE,
      lastLogin: '2024-01-25T08:30:00Z',
      permissions: ['read', 'write', 'manage_team'],
      notes: 'พนักงานดีเด่น ประจำเดือน',
      createdAt: '2023-06-15T09:00:00Z',
      updatedAt: '2024-01-25T08:30:00Z'
    },
    {
      id: 'emp-2',
      shopId: 'shop-1',
      employeeCode: 'EMP002',
      name: 'สมหญิง รักงาน',
      email: 'somying@example.com',
      phone: '082-345-6789',
      position: 'นักการตลาด',
      departmentId: '2',
      departmentName: 'การตลาด',
      salary: 35000,
      hireDate: '2023-08-01',
      status: EmployeeStatus.ACTIVE,
      lastLogin: '2024-01-24T17:00:00Z',
      permissions: ['read', 'write'],
      notes: undefined,
      createdAt: '2023-08-01T09:00:00Z',
      updatedAt: '2024-01-24T17:00:00Z'
    }
  ];

  async getDepartmentsData(): Promise<DepartmentsDataDTO> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const stats = this.calculateStats();

    return {
      departments: this.mockDepartments,
      stats,
      totalCount: this.mockDepartments.length
    };
  }

  async getDepartmentById(id: string): Promise<DepartmentDTO | null> {
    await new Promise(resolve => setTimeout(resolve, 50));

    const department = this.mockDepartments.find(d => d.id === id);
    return department || null;
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<DepartmentDTO> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newDepartment: DepartmentDTO = {
      id: `dept-${Date.now()}`,
      shopId: data.shopId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockDepartments.push(newDepartment);
    return newDepartment;
  }

  async updateDepartment(data: UpdateDepartmentDTO): Promise<DepartmentDTO | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const index = this.mockDepartments.findIndex(d => d.id === data.id);
    if (index === -1) return null;

    const updatedDepartment = {
      ...this.mockDepartments[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.mockDepartments[index] = updatedDepartment;
    return updatedDepartment;
  }

  async deleteDepartment(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const index = this.mockDepartments.findIndex(d => d.id === id);
    if (index === -1) return false;

    this.mockDepartments.splice(index, 1);
    return true;
  }

  async getDepartmentEmployees(departmentId: string): Promise<EmployeeDTO[]> {
    await new Promise(resolve => setTimeout(resolve, 50));

    return this.mockEmployees.filter(emp => emp.departmentId === departmentId);
  }

  private calculateStats(): DepartmentStatsDTO {
    const totalDepartments = this.mockDepartments.length;
    const totalEmployees = this.mockDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0);
    const activeDepartments = this.mockDepartments.filter(dept => dept.employeeCount > 0).length;
    const averageEmployeesPerDepartment = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0;

    return {
      totalDepartments,
      totalEmployees,
      activeDepartments,
      averageEmployeesPerDepartment
    };
  }
}
