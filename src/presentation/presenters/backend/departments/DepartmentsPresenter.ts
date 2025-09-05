import type { CreateDepartmentDTO, DepartmentDTO, DepartmentStatsDTO, UpdateDepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import type { IBackendDepartmentsService } from '@/src/application/services/backend/BackendDepartmentsService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface DepartmentData {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string | null;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStatsData {
  totalDepartments: number;
  totalEmployees: number;
  activeDepartments: number;
  averageEmployeesPerDepartment: number;
}

export interface DepartmentsData {
  departments: DepartmentData[];
  stats: DepartmentStatsData;
  totalCount: number;
}

// Define ViewModel interface
export interface DepartmentsViewModel {
  departments: DepartmentData[];
  stats: DepartmentStatsData;
  totalCount: number;
  error: string | null;
}

export interface DepartmentDetailsViewModel {
  department: DepartmentData | null;
  employees: unknown[];
  error: string | null;
}

export interface CreateDepartmentViewModel {
  department: DepartmentData | null;
  success: boolean;
  error: string | null;
}

export interface UpdateDepartmentViewModel {
  department: DepartmentData | null;
  success: boolean;
  error: string | null;
}

export interface DeleteDepartmentViewModel {
  success: boolean;
  error: string | null;
}

// Main Presenter class
export class DepartmentsPresenter {
  constructor(
    private readonly logger: Logger,
    private readonly departmentsService: IBackendDepartmentsService
  ) { }

  async getMetadata() {
    return {
      title: 'จัดการแผนก - ระบบจัดการคิว',
      description: 'จัดการข้อมูลแผนกต่างๆ ในระบบจัดการคิว'
    };
  }

  async getViewModel(): Promise<DepartmentsViewModel> {
    return this.getDepartmentsViewModel();
  }

  async getDepartmentsViewModel(): Promise<DepartmentsViewModel> {
    try {
      this.logger.info('Getting departments data for view');

      const departmentsData = await this.departmentsService.getDepartmentsData();

      return {
        departments: departmentsData.departments.map(this.mapDepartmentDTO),
        stats: this.mapStatsDTO(departmentsData.stats),
        totalCount: departmentsData.totalCount,
        error: null
      };
    } catch (error) {
      this.logger.error('Error getting departments data', { error });
      return {
        departments: [],
        stats: {
          totalDepartments: 0,
          totalEmployees: 0,
          activeDepartments: 0,
          averageEmployeesPerDepartment: 0
        },
        totalCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getDepartmentByIdViewModel(id: string): Promise<DepartmentDetailsViewModel> {
    try {
      this.logger.info('Getting department by ID for view', { id });

      const department = await this.departmentsService.getDepartmentById(id);

      return {
        department: this.mapDepartmentDTO(department),
        employees: [], // Note: getDepartmentEmployees method was removed from the service
        error: null
      };
    } catch (error) {
      this.logger.error('Error getting department by ID', { error, id });
      return {
        department: null,
        employees: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async createDepartmentViewModel(data: CreateDepartmentDTO): Promise<CreateDepartmentViewModel> {
    try {
      this.logger.info('Creating department', { data });

      const department = await this.departmentsService.createDepartment(data);

      return {
        department: this.mapDepartmentDTO(department),
        success: true,
        error: null
      };
    } catch (error) {
      this.logger.error('Error creating department', { error, data });
      return {
        department: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updateDepartmentViewModel(data: UpdateDepartmentDTO): Promise<UpdateDepartmentViewModel> {
    try {
      this.logger.info('Updating department', { data });

      const department = await this.departmentsService.updateDepartment(data.id, data);

      return {
        department: this.mapDepartmentDTO(department),
        success: true,
        error: null
      };
    } catch (error) {
      this.logger.error('Error updating department', { error, data });
      return {
        department: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async deleteDepartmentViewModel(id: string): Promise<DeleteDepartmentViewModel> {
    try {
      this.logger.info('Deleting department', { id });

      const success = await this.departmentsService.deleteDepartment(id);

      return {
        success,
        error: success ? null : 'Failed to delete department'
      };
    } catch (error) {
      this.logger.error('Error deleting department', { error, id });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private mapDepartmentDTO(dto: DepartmentDTO): DepartmentData {
    return {
      id: dto.id,
      shopId: dto.shopId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      employeeCount: dto.employeeCount,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    };
  }

  private mapStatsDTO(dto: DepartmentStatsDTO): DepartmentStatsData {
    return {
      totalDepartments: dto.totalDepartments,
      totalEmployees: dto.totalEmployees,
      activeDepartments: dto.activeDepartments,
      averageEmployeesPerDepartment: dto.averageEmployeesPerDepartment
    };
  }
}

// Factory class
export class DepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const container = await getBackendContainer();
    const logger = container.resolve<Logger>('Logger');
    const departmentsService = container.resolve<IBackendDepartmentsService>('BackendDepartmentsService');

    return new DepartmentsPresenter(logger, departmentsService);
  }
}
