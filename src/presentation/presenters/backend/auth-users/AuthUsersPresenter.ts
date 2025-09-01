import type { AuthUsersDataDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { IBackendAuthUsersService } from '@/src/application/services/backend/BackendAuthUsersService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface AuthUsersViewModel {
  authUsersData: AuthUsersDataDTO;
}

// Main Presenter class
export class AuthUsersPresenter {
  constructor(
    private readonly backendAuthUsersService: IBackendAuthUsersService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<AuthUsersViewModel> {
    try {
      this.logger.info('AuthUsersPresenter: Getting view model');

      const authUsersData = await this.backendAuthUsersService.getAuthUsersData();

      return {
        authUsersData
      };
    } catch (error) {
      this.logger.error('AuthUsersPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการผู้ใช้งาน | Shop Queue Admin',
      description: 'ระบบจัดการผู้ใช้งานและการตรวจสอบยืนยันตัวตนสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, ผู้ใช้งาน, จัดการผู้ใช้, auth users, admin, backend, authentication',
    };
  }
}

// Factory class
export class AuthUsersPresenterFactory {
  static async create(): Promise<AuthUsersPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendAuthUsersService = serverContainer.resolve<IBackendAuthUsersService>('BackendAuthUsersService');
    return new AuthUsersPresenter(backendAuthUsersService, logger);
  }
}
