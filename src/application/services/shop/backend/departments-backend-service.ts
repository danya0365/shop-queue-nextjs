import type { Logger } from '@/src/domain/interfaces/logger';

// Department interfaces
export interface Department {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
}

export interface IDepartmentsBackendService {
  getDepartments(shopId: string): Promise<Department[]>;
  getDepartmentById(shopId: string, departmentId: string): Promise<Department | null>;
  createDepartment(shopId: string, data: CreateDepartmentData): Promise<Department>;
  updateDepartment(shopId: string, departmentId: string, data: UpdateDepartmentData): Promise<Department>;
  deleteDepartment(shopId: string, departmentId: string): Promise<boolean>;
}

export class DepartmentsBackendService implements IDepartmentsBackendService {
  constructor(private readonly logger: Logger) { }

  async getDepartments(shopId: string): Promise<Department[]> {
    this.logger.info('DepartmentsBackendService: Getting departments for shop', { shopId });

    // Mock data - replace with actual repository call
    const mockDepartments: Department[] = [
      {
        id: '1',
        shopId,
        name: 'แผนกตัดผม',
        description: 'แผนกที่ให้บริการตัดผมทุกประเภท',
        employeeCount: 3,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        shopId,
        name: 'แผนกย้อมสี',
        description: 'แผนกที่เชี่ยวชาญด้านการย้อมสีผม',
        employeeCount: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        shopId,
        name: 'แผนกดัดผม',
        description: 'แผนกที่ให้บริการดัดผมและจัดแต่งทรงผม',
        employeeCount: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '4',
        shopId,
        name: 'แผนกสระผม',
        description: 'แผนกที่ให้บริการสระผมและนวดศีรษะ',
        employeeCount: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '5',
        shopId,
        name: 'แผนกบริหาร',
        description: 'แผนกที่ดูแลการบริหารจัดการร้าน',
        employeeCount: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return mockDepartments;
  }

  async getDepartmentById(shopId: string, departmentId: string): Promise<Department | null> {
    this.logger.info('DepartmentsBackendService: Getting department by ID', { shopId, departmentId });

    const departments = await this.getDepartments(shopId);
    return departments.find(department => department.id === departmentId) || null;
  }

  async createDepartment(shopId: string, data: CreateDepartmentData): Promise<Department> {
    this.logger.info('DepartmentsBackendService: Creating department', { shopId, data });

    // Mock implementation - replace with actual repository call
    const newDepartment: Department = {
      id: Date.now().toString(),
      shopId,
      name: data.name,
      description: data.description || null,
      employeeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newDepartment;
  }

  async updateDepartment(shopId: string, departmentId: string, data: UpdateDepartmentData): Promise<Department> {
    this.logger.info('DepartmentsBackendService: Updating department', { shopId, departmentId, data });

    const existingDepartment = await this.getDepartmentById(shopId, departmentId);
    if (!existingDepartment) {
      throw new Error('Department not found');
    }

    // Mock implementation - replace with actual repository call
    const updatedDepartment: Department = {
      ...existingDepartment,
      ...data,
      updatedAt: new Date(),
    };

    return updatedDepartment;
  }

  async deleteDepartment(shopId: string, departmentId: string): Promise<boolean> {
    this.logger.info('DepartmentsBackendService: Deleting department', { shopId, departmentId });

    const existingDepartment = await this.getDepartmentById(shopId, departmentId);
    if (!existingDepartment) {
      throw new Error('Department not found');
    }

    // Check if department has employees
    if (existingDepartment.employeeCount > 0) {
      throw new Error('Cannot delete department with employees. Please reassign employees first.');
    }

    // Mock implementation - replace with actual repository call
    return true;
  }
}
