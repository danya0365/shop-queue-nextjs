import { IProfileRepositoryAdapter } from "../interfaces/profile-repository-adapter.interface";
import { CreateProfileUseCase } from "../usecases/profile/create-profile";
import { DeleteProfileUseCase } from "../usecases/profile/delete-profile";
import { GetActiveProfileByAuthIdUseCase } from "../usecases/profile/get-active-profile-by-auth-id";
import { GetCurrentUserProfileUseCase } from "../usecases/profile/get-current-user-profile";
import { GetProfileByIdUseCase } from "../usecases/profile/get-profile-by-id";
import { GetProfileByUserIdUseCase } from "../usecases/profile/get-profile-by-user-id";
import { GetProfilesByAuthIdUseCase } from "../usecases/profile/get-profiles-by-auth-id";
import { SetActiveProfileUseCase } from "../usecases/profile/set-active-profile";
import { UpdateProfileUseCase } from "../usecases/profile/update-profile";

/**
 * Factory for creating profile use cases
 * Following Factory Pattern to centralize creation logic
 */
export class ProfileUseCaseFactory {
  /**
   * Create a GetProfileByIdUseCase instance
   */
  static createGetProfileByIdUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): GetProfileByIdUseCase {
    return new GetProfileByIdUseCase(profileAdapter);
  }

  /**
   * Create a GetProfilesByAuthIdUseCase instance
   */
  static createGetProfilesByAuthIdUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): GetProfilesByAuthIdUseCase {
    return new GetProfilesByAuthIdUseCase(profileAdapter);
  }

  /**
   * Create a GetActiveProfileByAuthIdUseCase instance
   */
  static createGetActiveProfileByAuthIdUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): GetActiveProfileByAuthIdUseCase {
    return new GetActiveProfileByAuthIdUseCase(profileAdapter);
  }

  /**
   * Create a SetActiveProfileUseCase instance
   */
  static createSetActiveProfileUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): SetActiveProfileUseCase {
    return new SetActiveProfileUseCase(profileAdapter);
  }

  /**
   * Create a GetProfileByUserIdUseCase instance
   */
  static createGetProfileByUserIdUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): GetProfileByUserIdUseCase {
    return new GetProfileByUserIdUseCase(profileAdapter);
  }

  /**
   * Create a CreateProfileUseCase instance
   */
  static createCreateProfileUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): CreateProfileUseCase {
    return new CreateProfileUseCase(profileAdapter);
  }

  /**
   * Create a UpdateProfileUseCase instance
   */
  static createUpdateProfileUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): UpdateProfileUseCase {
    return new UpdateProfileUseCase(profileAdapter);
  }

  /**
   * Create a GetCurrentUserProfileUseCase instance
   */
  static createGetCurrentUserProfileUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): GetCurrentUserProfileUseCase {
    return new GetCurrentUserProfileUseCase(profileAdapter);
  }

  /**
   * Create a DeleteProfileUseCase instance
   */
  static createDeleteProfileUseCase(
    profileAdapter: IProfileRepositoryAdapter
  ): DeleteProfileUseCase {
    return new DeleteProfileUseCase(profileAdapter);
  }
}
