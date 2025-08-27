import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  salary: number;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  todayStats: {
    queuesServed: number;
    revenue: number;
    averageServiceTime: number;
    rating: number;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}


export interface EmployeeFilters {
  status: 'all' | 'active' | 'inactive' | 'on_leave';
  department: string;
  position: string;
  search: string;
}

// Define ViewModel interface
export interface EmployeesViewModel {
  employees: Employee[];
  departments: Department[];
  permissions: Permission[];
  filters: EmployeeFilters;
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalSalaryExpense: number;
}

// Main Presenter class
export class EmployeesPresenter {
  constructor(private readonly logger: Logger) { }

  async getViewModel(shopId: string): Promise<EmployeesViewModel> {
    try {
      this.logger.info('EmployeesPresenter: Getting view model for shop', { shopId });

      // Mock data - replace with actual service calls
      const employees = this.getEmployees();
      const departments = this.getDepartments();
      const permissions = this.getPermissions();

      return {
        employees,
        departments,
        permissions,
        filters: {
          status: 'all',
          department: 'all',
          position: 'all',
          search: '',
        },
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        onLeaveEmployees: employees.filter(e => e.status === 'on_leave').length,
        totalSalaryExpense: employees.reduce((sum, e) => sum + e.salary, 0),
      };
    } catch (error) {
      this.logger.error('EmployeesPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getEmployees(): Employee[] {
    return [
      {
        id: '1',
        name: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        phone: '081-234-5678',
        position: 'พนักงานบริการ',
        department: 'บริการลูกค้า',
        status: 'active',
        hireDate: '2023-01-15',
        salary: 18000,
        permissions: ['serve_customers', 'process_payments', 'view_queue'],
        avatar: '👨‍💼',
        lastLogin: '2024-01-15 09:30',
        todayStats: {
          queuesServed: 12,
          revenue: 2450,
          averageServiceTime: 8,
          rating: 4.8,
        },
      },
      {
        id: '2',
        name: 'สมหญิง รักงาน',
        email: 'somying@example.com',
        phone: '082-345-6789',
        position: 'หัวหน้าแผนก',
        department: 'บริการลูกค้า',
        status: 'active',
        hireDate: '2022-06-01',
        salary: 25000,
        permissions: ['serve_customers', 'process_payments', 'view_queue', 'manage_employees', 'view_reports'],
        avatar: '👩‍💼',
        lastLogin: '2024-01-15 08:45',
        todayStats: {
          queuesServed: 8,
          revenue: 1890,
          averageServiceTime: 12,
          rating: 4.9,
        },
      },
      {
        id: '3',
        name: 'สมปอง มีความสุข',
        email: 'sompong@example.com',
        phone: '083-456-7890',
        position: 'พนักงานบริการ',
        department: 'บริการลูกค้า',
        status: 'on_leave',
        hireDate: '2023-03-20',
        salary: 18000,
        permissions: ['serve_customers', 'process_payments', 'view_queue'],
        avatar: '👨‍🍳',
        lastLogin: '2024-01-12 17:30',
        todayStats: {
          queuesServed: 0,
          revenue: 0,
          averageServiceTime: 0,
          rating: 0,
        },
      },
      {
        id: '4',
        name: 'สมศรี ขยันทำงาน',
        email: 'somsri@example.com',
        phone: '084-567-8901',
        position: 'แคชเชียร์',
        department: 'การเงิน',
        status: 'active',
        hireDate: '2023-08-10',
        salary: 16000,
        permissions: ['process_payments', 'view_queue', 'manage_cash'],
        avatar: '👩‍💻',
        lastLogin: '2024-01-15 10:15',
        todayStats: {
          queuesServed: 15,
          revenue: 3200,
          averageServiceTime: 5,
          rating: 4.7,
        },
      },
    ];
  }

  private getDepartments(): Department[] {
    return [
      {
        id: '1',
        name: 'บริการลูกค้า',
        description: 'ให้บริการลูกค้าและจัดการคิว',
        employeeCount: 3,
      },
      {
        id: '2',
        name: 'การเงิน',
        description: 'จัดการการชำระเงินและบัญชี',
        employeeCount: 1,
      },
      {
        id: '3',
        name: 'จัดการ',
        description: 'บริหารจัดการและกำกับดูแล',
        employeeCount: 0,
      },
    ];
  }

  private getPermissions(): Permission[] {
    return [
      {
        id: 'serve_customers',
        name: 'ให้บริการลูกค้า',
        description: 'สามารถให้บริการและจัดการคิวลูกค้า',
        category: 'บริการ',
      },
      {
        id: 'process_payments',
        name: 'ประมวลผลการชำระเงิน',
        description: 'สามารถรับชำระเงินและออกใบเสร็จ',
        category: 'การเงิน',
      },
      {
        id: 'view_queue',
        name: 'ดูข้อมูลคิว',
        description: 'สามารถดูสถานะและข้อมูลคิว',
        category: 'ข้อมูล',
      },
      {
        id: 'manage_employees',
        name: 'จัดการพนักงาน',
        description: 'สามารถจัดการข้อมูลและสิทธิ์พนักงาน',
        category: 'จัดการ',
      },
      {
        id: 'view_reports',
        name: 'ดูรายงาน',
        description: 'สามารถดูรายงานและสถิติต่างๆ',
        category: 'รายงาน',
      },
      {
        id: 'manage_cash',
        name: 'จัดการเงินสด',
        description: 'สามารถจัดการเงินสดและยอดขาย',
        category: 'การเงิน',
      },
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'จัดการพนักงาน - เจ้าของร้าน | Shop Queue',
      description: 'จัดการข้อมูลพนักงาน สิทธิ์การเข้าถึง และประสิทธิภาพการทำงาน',
    };
  }
}

// Factory class
export class EmployeesPresenterFactory {
  static async create(): Promise<EmployeesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new EmployeesPresenter(logger);
  }
}
