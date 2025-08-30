import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IBackendProfilesService } from '@/src/application/services/backend/BackendProfilesService';
import type { ProfilesDataDTO } from '@/src/application/dtos/backend/ProfilesDTO';

// Define ViewModel interface
export interface ProfilesViewModel {
  profilesData: ProfilesDataDTO;
}

// Main Presenter class
export class ProfilesPresenter {
  constructor(
    private readonly backendProfilesService: IBackendProfilesService,
    private readonly logger: Logger
  ) {}

  async getViewModel(): Promise<ProfilesViewModel> {
    try {
      this.logger.info('ProfilesPresenter: Getting view model');
      
      const profilesData = await this.backendProfilesService.getProfilesData();
      
      return {
        profilesData
      };
    } catch (error) {
      this.logger.error('ProfilesPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการโปรไฟล์ | Shop Queue Admin',
      description: 'ระบบจัดการโปรไฟล์ผู้ใช้และการตรวจสอบยืนยันตัวตนสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, โปรไฟล์, จัดการโปรไฟล์, admin, backend, verification',
    };
  }
}

// Factory class
export class ProfilesPresenterFactory {
  static async create(): Promise<ProfilesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendProfilesService = serverContainer.resolve<IBackendProfilesService>('BackendProfilesService');
    return new ProfilesPresenter(backendProfilesService, logger);
  }
}
