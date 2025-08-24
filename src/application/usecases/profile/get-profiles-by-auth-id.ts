import { Logger } from '@/src/domain/interfaces/logger';
import { ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting profiles by auth ID
 * Following the Clean Architecture pattern and SOLID principles
 */
export class GetProfilesByAuthIdUseCase implements IUseCase<string, ProfileDto[]> {
  constructor(
    private profileAdapter: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to get profiles by auth ID
   * @param authId Auth ID
   * @returns Array of profile DTOs
   */
  async execute(authId: string): Promise<ProfileDto[]> {
    try {
      return await this.profileAdapter.getByAuthId(authId);
    } catch (error) {
      this.logger?.error('Error getting profiles by auth ID', error, { authId });
      return [];
    }
  }
}
