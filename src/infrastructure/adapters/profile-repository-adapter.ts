import { Logger } from "@/src/domain/interfaces/logger";
import {
  CreateProfileInputDto,
  ProfileDto,
  UpdateProfileInputDto,
} from "../../application/dtos/profile-dto";
import {
  ProfileAlreadyExistsException,
  ProfileNotFoundException,
  ProfileRepositoryException,
  ProfileUnauthorizedException,
  ProfileValidationException,
} from "../../application/exceptions/profile-exceptions";
import { IProfileRepositoryAdapter } from "../../application/interfaces/profile-repository-adapter.interface";
import { ProfileMapper } from "../../application/mappers/profile-mapper";
import { ProfileCreate, ProfileUpdate } from "../../domain/entities/profile";
import {
  ProfileError,
  ProfileErrorType,
  ProfileRepository,
} from "../../domain/repositories/profile-repository";
import {
  DatabaseOperationException,
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from "../exceptions/repository-exceptions";

/**
 * Adapter for ProfileRepository that converts between domain entities and DTOs
 * Following Clean Architecture by separating infrastructure and application layers
 */
export class ProfileRepositoryAdapter implements IProfileRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository The actual repository implementation
   * @param logger Logger for error tracking
   */
  constructor(
    private readonly repository: ProfileRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Get profiles by auth ID as DTOs
   * @param authId Auth ID
   * @returns Array of profile DTOs
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async getByAuthId(authId: string): Promise<ProfileDto[]> {
    try {
      const profiles = await this.repository.getByAuthId(authId);
      return profiles.map((profile) => ProfileMapper.toDto(profile));
    } catch (error) {
      this.logger.error(`Error getting profiles by auth ID: ${authId}`, error);
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Get a profile by ID as DTO
   * @param id Profile ID
   * @returns Profile DTO or null if not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async getById(id: string): Promise<ProfileDto | null> {
    try {
      const profile = await this.repository.getById(id);
      return profile ? ProfileMapper.toDto(profile) : null;
    } catch (error) {
      this.logger.error(`Error getting profile by ID: ${id}`, error);
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Get a profile by user ID (auth ID) as DTO
   * @param userId User ID (auth ID)
   * @returns Profile DTO or null if not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async getByUserId(userId: string): Promise<ProfileDto | null> {
    try {
      // In our system, userId is the same as authId, so we can reuse getActiveByAuthId
      // This is based on the multi-profile system where each auth user can have multiple profiles
      const profiles = await this.repository.getByAuthId(userId);
      if (!profiles || profiles.length === 0) {
        return null;
      }
      // Return the active profile if available, otherwise the first profile
      const activeProfile = profiles.find(profile => profile.isActive);
      return ProfileMapper.toDto(activeProfile || profiles[0]);
    } catch (error) {
      this.logger.error(`Error getting profile by user ID: ${userId}`, error);
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Get active profile by auth ID as DTO
   * @param authId Auth ID
   * @returns Profile DTO or null if not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async getActiveByAuthId(authId: string): Promise<ProfileDto | null> {
    try {
      const profile = await this.repository.getActiveByAuthId(authId);
      return profile ? ProfileMapper.toDto(profile) : null;
    } catch (error) {
      this.logger.error(
        `Error getting active profile by auth ID: ${authId}`,
        error
      );
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Create a new profile
   * @param profileDto Profile data to create
   * @returns Created profile as DTO
   * @throws ProfileAlreadyExistsException if a profile with the same username already exists
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async create(profileDto: CreateProfileInputDto): Promise<ProfileDto> {
    try {
      // Convert DTO to domain entity
      const profileCreate: ProfileCreate =
        ProfileMapper.createDtoToDomain(profileDto);

      const profile = await this.repository.create(profileCreate);
      return ProfileMapper.toDto(profile);
    } catch (error) {
      this.logger.error("Error creating profile", error);
      if (error instanceof EntityAlreadyExistsException) {
        throw new ProfileAlreadyExistsException(profileDto.username);
      }
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param profileDto Updated profile data
   * @returns Updated profile as DTO
   * @throws ProfileNotFoundException if the profile is not found
   * @throws ProfileAlreadyExistsException if updating the username and it already exists
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async update(
    id: string,
    profileDto: UpdateProfileInputDto
  ): Promise<ProfileDto> {
    try {
      // Convert DTO to domain entity
      const profileUpdate: ProfileUpdate =
        ProfileMapper.updateDtoToDomain(profileDto);

      const profile = await this.repository.update(id, profileUpdate);
      return ProfileMapper.toDto(profile);
    } catch (error) {
      this.logger.error(`Error updating profile: ${id}`, error);
      if (error instanceof EntityNotFoundException) {
        throw new ProfileNotFoundException(id);
      }
      if (error instanceof EntityAlreadyExistsException) {
        // Use the username from the DTO if available, otherwise use a fallback
        const username = profileDto.username || "unknown";
        throw new ProfileAlreadyExistsException(username);
      }
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Set a profile as active
   * @param id Profile ID
   * @param authId Auth ID
   * @throws ProfileNotFoundException if the profile is not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async setActive(id: string, authId: string): Promise<void> {
    try {
      await this.repository.setActive(id, authId);
    } catch (error) {
      this.logger.error(
        `Error setting profile ${id} as active for auth ID: ${authId}`,
        error
      );
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Delete a profile
   * @param id Profile ID
   * @throws ProfileNotFoundException if the profile is not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting profile: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get the current user's profile
   * @returns Profile DTO or null if not found or not authenticated
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  async getCurrentUserProfile(): Promise<ProfileDto | null> {
    try {
      // This would typically use the auth context to get the current user's ID
      // Since we're in an adapter, we'll need to delegate to the repository
      const profile = await this.repository.getCurrentUserProfile();
      return profile ? ProfileMapper.toDto(profile) : null;
    } catch (error) {
      this.logger.error('Error getting current user profile', error);
      if (error instanceof DatabaseOperationException) {
        throw new ProfileRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Maps domain-specific errors to application exceptions
   * Following Single Responsibility Principle by centralizing error mapping
   * @param error The error to map
   * @param id Optional profile ID for context
   * @param username Optional username for context
   * @throws Application-specific exceptions based on the domain error
   */
  private mapDomainErrorToApplicationError(
    error: Error,
    id?: string,
    username?: string
  ): never {
    if (error instanceof ProfileError) {
      switch (error.type) {
        case ProfileErrorType.NOT_FOUND:
          throw new ProfileNotFoundException(id || "unknown");
        case ProfileErrorType.ALREADY_EXISTS:
          throw new ProfileAlreadyExistsException(username || "unknown");
        case ProfileErrorType.VALIDATION_ERROR:
          throw new ProfileValidationException(error.message, error);
        case ProfileErrorType.UNAUTHORIZED:
          throw new ProfileUnauthorizedException(error.message, error);
        default:
          throw new ProfileRepositoryException(error.message, error);
      }
    }

    if (error instanceof EntityNotFoundException) {
      throw new ProfileNotFoundException(id || "unknown");
    }
    if (error instanceof EntityAlreadyExistsException) {
      throw new ProfileAlreadyExistsException(username || "unknown");
    }
    if (error instanceof DatabaseOperationException) {
      throw new ProfileRepositoryException(error.message, error);
    }

    throw new ProfileRepositoryException(
      `Unexpected error: ${error.message}`,
      error
    );
  }
}
