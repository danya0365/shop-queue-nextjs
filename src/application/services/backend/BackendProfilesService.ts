import type { ProfileDTO, ProfilesDataDTO } from '@/src/application/dtos/backend/profiles-dto';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { CreateProfileUseCaseInput, ICreateProfileUseCase } from '@/src/application/usecases/backend/profiles/CreateProfileUseCase';
import type { IDeleteProfileUseCase } from '@/src/application/usecases/backend/profiles/DeleteProfileUseCase';
import type { IGetProfileByIdUseCase } from '@/src/application/usecases/backend/profiles/GetProfileByIdUseCase';
import type { IGetProfileStatsUseCase } from '@/src/application/usecases/backend/profiles/GetProfileStatsUseCase';
import type { IGetProfilesUseCase } from '@/src/application/usecases/backend/profiles/GetProfilesUseCase';
import type { IUpdateProfileUseCase, UpdateProfileUseCaseInput } from '@/src/application/usecases/backend/profiles/UpdateProfileUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendProfilesService {
  getProfilesData(page?: number, perPage?: number): Promise<ProfilesDataDTO>;
  getProfileById(id: string): Promise<ProfileDTO>;
  createProfile(profileData: CreateProfileUseCaseInput): Promise<ProfileDTO>;
  updateProfile(id: string, profileData: Omit<UpdateProfileUseCaseInput, 'id'>): Promise<ProfileDTO>;
  deleteProfile(id: string): Promise<boolean>;
}

export class BackendProfilesService implements IBackendProfilesService {
  constructor(
    private readonly getProfilesUseCase: IGetProfilesUseCase,
    private readonly getProfileStatsUseCase: IGetProfileStatsUseCase,
    private readonly getProfileByIdUseCase: IGetProfileByIdUseCase,
    private readonly createProfileUseCase: ICreateProfileUseCase,
    private readonly updateProfileUseCase: IUpdateProfileUseCase,
    private readonly deleteProfileUseCase: IDeleteProfileUseCase,
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
      const [profilesResult, statsResult] = await Promise.all([
        this.getProfilesUseCase.execute({ page, perPage }),
        this.getProfileStatsUseCase.execute()
      ]);

      // Map domain entities to DTOs
      const profiles = profilesResult.profiles.data.map(profile => ProfileMapper.toDTO(profile));
      const stats = ProfileMapper.statsToDTO(statsResult.stats);

      this.logger.info('Profiles data retrieved', { data: profilesResult.profiles.data });

      // Create response DTO
      return {
        profiles,
        stats,
        totalCount: profilesResult.profiles.pagination.totalItems,
        currentPage: profilesResult.profiles.pagination.currentPage,
        perPage: profilesResult.profiles.pagination.itemsPerPage
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

      const result = await this.getProfileByIdUseCase.execute({ id });
      if (!result.profile) {
        throw new Error(`Profile with ID ${id} not found`);
      }
      return ProfileMapper.toDTO(result.profile);
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
      return ProfileMapper.toDTO(result.profile);
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
      return ProfileMapper.toDTO(result.profile);
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

      const result = await this.deleteProfileUseCase.execute({ id });
      return result.success;
    } catch (error) {
      this.logger.error('Error deleting profile', { error, id });
      throw error;
    }
  }
}
