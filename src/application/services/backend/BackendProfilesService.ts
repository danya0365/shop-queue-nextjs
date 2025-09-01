import type { ProfilesDataDTO } from '@/src/application/dtos/backend/profiles-dto';
import type { IGetProfilesUseCase } from '@/src/application/usecases/backend/profiles/GetProfilesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendProfilesService {
  getProfilesData(): Promise<ProfilesDataDTO>;
}

export class BackendProfilesService implements IBackendProfilesService {
  constructor(
    private readonly getProfilesUseCase: IGetProfilesUseCase,
    private readonly logger: Logger
  ) { }

  async getProfilesData(): Promise<ProfilesDataDTO> {
    try {
      this.logger.info('BackendProfilesService: Getting profiles data');

      const profilesData = await this.getProfilesUseCase.execute();

      this.logger.info('BackendProfilesService: Successfully retrieved profiles data');
      return profilesData;
    } catch (error) {
      this.logger.error('BackendProfilesService: Error getting profiles data', error);
      throw error;
    }
  }
}
