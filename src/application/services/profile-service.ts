import { ErrorHandlingDecorator } from "../decorators/error-handling.decorator";
import {
  CreateProfileDto,
  ProfileDto,
  UpdateProfileDto,
} from "../dtos/profile-dto";
import { ProfileUseCaseFactory } from "../factories/profile-use-case.factory";
import type { ILogger } from "../interfaces/logger.interface";
import type { IProfileRepositoryAdapter } from "../interfaces/profile-repository-adapter.interface";
import type { IProfileService } from "../interfaces/profile-service.interface";
import type { IUseCase } from "../interfaces/use-case.interface";
import { DeleteProfileInput } from "../usecases/profile/delete-profile";
import { SetActiveProfileInput } from "../usecases/profile/set-active-profile";

/**
 * Service class for profile operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class ProfileService implements IProfileService {
  private readonly getProfileByIdUseCase: IUseCase<string, ProfileDto | null>;
  private readonly getProfilesByAuthIdUseCase: IUseCase<string, ProfileDto[]>;
  private readonly getActiveProfileByAuthIdUseCase: IUseCase<
    string,
    ProfileDto | null
  >;
  private readonly setActiveProfileUseCase: IUseCase<
    SetActiveProfileInput,
    boolean
  >;
  private readonly getProfileByUserIdUseCase: IUseCase<
    string,
    ProfileDto | null
  >;
  private readonly createProfileUseCase: IUseCase<CreateProfileDto, ProfileDto>;
  private readonly updateProfileUseCase: IUseCase<
    { id: string; data: UpdateProfileDto },
    ProfileDto | null
  >;
  private readonly getCurrentUserProfileUseCase: IUseCase<
    void,
    ProfileDto | null
  >;
  private readonly deleteProfileUseCase: IUseCase<DeleteProfileInput, void>;

  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly profileAdapter: IProfileRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getProfileByIdUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createGetProfileByIdUseCase(profileAdapter),
      logger
    );

    this.getProfilesByAuthIdUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createGetProfilesByAuthIdUseCase(profileAdapter),
      logger
    );

    this.getActiveProfileByAuthIdUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createGetActiveProfileByAuthIdUseCase(
        profileAdapter
      ),
      logger
    );

    this.setActiveProfileUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createSetActiveProfileUseCase(profileAdapter),
      logger
    );

    this.getProfileByUserIdUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createGetProfileByUserIdUseCase(profileAdapter),
      logger
    );

    this.createProfileUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createCreateProfileUseCase(profileAdapter),
      logger
    );

    this.updateProfileUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createUpdateProfileUseCase(profileAdapter),
      logger
    );

    this.getCurrentUserProfileUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createGetCurrentUserProfileUseCase(profileAdapter),
      logger
    );

    this.deleteProfileUseCase = new ErrorHandlingDecorator(
      ProfileUseCaseFactory.createDeleteProfileUseCase(profileAdapter),
      logger
    );
  }

  /**
   * Get a profile by its ID
   * @param id Profile ID
   * @returns Profile DTO or null if not found
   */
  async getProfileById(id: string): Promise<ProfileDto | null> {
    // Error handling is now managed by the decorator
    return this.getProfileByIdUseCase.execute(id);
  }

  /**
   * Get all profiles for a user by auth ID
   * @param authId Auth ID
   * @returns Array of profile DTOs
   */
  async getProfilesByAuthId(authId: string): Promise<ProfileDto[]> {
    // Error handling is now managed by the decorator
    return this.getProfilesByAuthIdUseCase.execute(authId);
  }

  /**
   * Get the active profile for a user by auth ID
   * @param authId Auth ID
   * @returns Active profile DTO or null if not found
   */
  async getActiveProfileByAuthId(authId: string): Promise<ProfileDto | null> {
    // Error handling is now managed by the decorator
    return this.getActiveProfileByAuthIdUseCase.execute(authId);
  }

  /**
   * Set a profile as active
   * @param profileId Profile ID to set as active
   * @param authId Auth ID of the user
   * @returns Promise<void>
   */
  async setActiveProfile(profileId: string, authId: string): Promise<boolean> {
    // Error handling is now managed by the decorator
    return this.setActiveProfileUseCase.execute({ profileId, authId });
  }

  /**
   * Get a profile by user ID
   * @param userId User ID
   * @returns Profile DTO or null if not found
   */
  async getProfileByUserId(userId: string): Promise<ProfileDto | null> {
    // Error handling is now managed by the decorator
    return this.getProfileByUserIdUseCase.execute(userId);
  }

  /**
   * Create a new profile
   * @param profileData Data for the new profile
   * @returns Created profile as DTO
   */
  async createProfile(profileData: CreateProfileDto): Promise<ProfileDto> {
    // Error handling is now managed by the decorator
    return this.createProfileUseCase.execute(profileData);
  }

  /**
   * Update a profile
   * @param id Profile ID
   * @param profileData Data to update
   * @returns Updated profile as DTO
   */
  async updateProfile(
    id: string,
    profileData: UpdateProfileDto
  ): Promise<ProfileDto | null> {
    // Error handling is now managed by the decorator
    return this.updateProfileUseCase.execute({ id, data: profileData });
  }

  /**
   * Get the current user's profile
   * @returns Profile DTO or null if not found or not authenticated
   */
  async getCurrentUserProfile(): Promise<ProfileDto | null> {
    // Error handling is now managed by the decorator
    return this.getCurrentUserProfileUseCase.execute();
  }

  /**
   * Delete a profile
   * @param payload Input containing profile ID
   * @throws ProfileNotFoundException if the profile is not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async deleteProfile(payload: DeleteProfileInput): Promise<void> {
    // Error handling is now managed by the decorator
    return this.deleteProfileUseCase.execute(payload);
  }
}
