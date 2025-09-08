import type { Department, DepartmentsBackendService } from '@/src/application/services/shop/backend/departments-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '../BaseShopPresenter';

// Define ViewModel interface
export interface DepartmentsViewModel {
  departments: Department[];
  totalDepartments: number;
  totalEmployees: number;
  averageEmployeesPerDepartment: number;
}

// Main Presenter class
export class DepartmentsPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    private readonly departmentsBackendService: DepartmentsBackendService,
  ) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<DepartmentsViewModel> {
    try {
      this.logger.info('DepartmentsPresenter: Getting view model', { shopId });

      // Get departments data
      const departments = await this.departmentsBackendService.getDepartments(shopId);

      // Calculate statistics
      const totalDepartments = departments.length;
      const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
      const averageEmployeesPerDepartment = totalDepartments > 0 ? totalEmployees / totalDepartments : 0;

      return {
        departments,
        totalDepartments,
        totalEmployees,
        averageEmployeesPerDepartment,
      };
    } catch (error) {
      this.logger.error('DepartmentsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(shopId, 'จัดการแผนก', 'จัดการแผนกต่างๆ ในร้าน เพิ่ม แก้ไข และจัดสรรพนักงาน');
  }
}

// Factory class
export class DepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const departmentsBackendService = serverContainer.resolve<DepartmentsBackendService>('DepartmentsBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new DepartmentsPresenter(logger, shopService, departmentsBackendService);
  }
}
