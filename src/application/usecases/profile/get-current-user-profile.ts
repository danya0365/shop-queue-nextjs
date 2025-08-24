import { ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting the current user's profile
 * Following the Clean Architecture pattern
 */
export class GetCurrentUserProfileUseCase implements IUseCase<void, ProfileDto | null> {
  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   */
  constructor(private readonly profileAdapter: IProfileRepositoryAdapter) {}

  /**
   * Execute the use case to get the current user's profile
   * @returns Profile DTO or null if not found or not authenticated
   */
  async execute(): Promise<ProfileDto | null> {
    // Get current user profile
    return this.profileAdapter.getCurrentUserProfile();
  }
}
