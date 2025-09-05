import type { DepartmentDTO, DepartmentStatsDTO } from '@/src/application/dtos/backend/department-dto';
import { BackendDepartmentsService } from '@/src/application/services/backend/BackendDepartmentsService';
import { getServerContainer } from '@/src/di/server-container';
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
  departmentsData: DepartmentsData;
}

// Main Presenter class
export class DepartmentsPresenter {
  constructor(
    private readonly logger: Logger,
    private readonly departmentsService: BackendDepartmentsService
  ) { }

  async getViewModel(): Promise<DepartmentsViewModel> {
    try {
      this.logger.info('DepartmentsPresenter: Getting view model');

      const departmentsData = await this.getDepartmentsData();

      return {
        departmentsData
      };
    } catch (error) {
      this.logger.error('DepartmentsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private async getDepartmentsData(): Promise<DepartmentsData> {
    try {
      const data = await this.departmentsService.getDepartmentsData();

      return {
        departments: data.departments.map(this.mapDepartmentDTO),
        stats: this.mapStatsDTO(data.stats),
        totalCount: data.totalCount
      };
    } catch (error) {
      this.logger.error('DepartmentsPresenter: Error getting departments data', error);
      throw new Error('ไม่สามารถโหลดข้อมูลแผนกได้');
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

  // Metadata generation
  getMetadata() {
    return {
      title: 'จัดการแผนก | Shop Queue Admin',
      description: 'ระบบจัดการแผนกและพนักงานสำหรับผู้ดูแลระบบ Shop Queue',
    };
  }
}

// Factory class
export class DepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const departmentsService = new BackendDepartmentsService();
    return new DepartmentsPresenter(logger, departmentsService);
  }
}
