import { Logger } from '@/src/domain/interfaces/logger';
import { ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting the active profile for a user by auth ID
 * Following the Clean Architecture pattern and SOLID principles
 */
export class GetActiveProfileByAuthIdUseCase implements IUseCase<string, ProfileDto | null> {
  constructor(
    private profileAdapter: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to get the active profile for a user by auth ID
   * @param authId Auth ID of the user
   * @returns Active profile DTO or null if not found
   */
  async execute(authId: string): Promise<ProfileDto | null> {
    try {
      return await this.profileAdapter.getActiveByAuthId(authId);
    } catch (error) {
      this.logger?.error('Error getting active profile by auth ID', error, { authId });
      return null;
    }
  }
}
