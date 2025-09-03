import type { CreateProfileUseCaseInput, PaginatedProfilesDTO, ProfileDTO, ProfilesDataDTO, ProfileStatsDTO, UpdateProfileUseCaseInput } from '@/src/application/dtos/backend/profiles-dto';
import type { GetProfilesPaginatedUseCaseInput } from '@/src/application/usecases/backend/profiles/GetProfilesPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface IBackendProfilesService {
  getProfilesData(page?: number, perPage?: number): Promise<ProfilesDataDTO>;
  getProfileById(id: string): Promise<ProfileDTO>;
  createProfile(profileData: CreateProfileUseCaseInput): Promise<ProfileDTO>;
  updateProfile(id: string, profileData: Omit<UpdateProfileUseCaseInput, 'id'>): Promise<ProfileDTO>;
  deleteProfile(id: string): Promise<boolean>;
}

export class BackendProfilesService implements IBackendProfilesService {
  constructor(
    private readonly getProfilesPaginatedUseCase: IUseCase<GetProfilesPaginatedUseCaseInput, PaginatedProfilesDTO>,
    private readonly getProfileStatsUseCase: IUseCase<void, ProfileStatsDTO>,
    private readonly getProfileByIdUseCase: IUseCase<string, ProfileDTO>,
    private readonly createProfileUseCase: IUseCase<CreateProfileUseCaseInput, ProfileDTO>,
    private readonly updateProfileUseCase: IUseCase<UpdateProfileUseCaseInput, ProfileDTO>,
    private readonly deleteProfileUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get profiles data including paginated profiles and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Profiles data DTO
   */
  async getProfilesData(page: number = 1, perPage: number = 10): Promise<ProfilesDataDTO> {
    try {
      this.logger.info('Getting profiles data', { page, perPage });

      // Get profiles and stats in parallel
      const [profilesResult, stats] = await Promise.all([
        this.getProfilesPaginatedUseCase.execute({ page, perPage }),
        this.getProfileStatsUseCase.execute()
      ]);

      return {
        profiles: profilesResult.data,
        stats,
        totalCount: profilesResult.pagination.totalItems,
        currentPage: profilesResult.pagination.currentPage,
        perPage: profilesResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting profiles data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get a profile by ID
   * @param id Profile ID
   * @returns Profile DTO
   */
  async getProfileById(id: string): Promise<ProfileDTO> {
    try {
      this.logger.info('Getting profile by ID', { id });

      const result = await this.getProfileByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting profile by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new profile
   * @param profileData Profile data
   * @returns Created profile DTO
   */
  async createProfile(profileData: CreateProfileUseCaseInput): Promise<ProfileDTO> {
    try {
      this.logger.info('Creating profile', { profileData });

      const result = await this.createProfileUseCase.execute(profileData);
      return result;
    } catch (error) {
      this.logger.error('Error creating profile', { error, profileData });
      throw error;
    }
  }

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param profileData Profile data to update
   * @returns Updated profile DTO
   */
  async updateProfile(id: string, profileData: Omit<UpdateProfileUseCaseInput, 'id'>): Promise<ProfileDTO> {
    try {
      this.logger.info('Updating profile', { id, profileData });

      const updateData = { id, ...profileData };
      const result = await this.updateProfileUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating profile', { error, id, profileData });
      throw error;
    }
  }

  /**
   * Delete a profile
   * @param id Profile ID
   * @returns Success flag
   */
  async deleteProfile(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting profile', { id });

      const result = await this.deleteProfileUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting profile', { error, id });
      throw error;
    }
  }
}
