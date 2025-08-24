import { Logger } from '@/src/domain/interfaces/logger';
import { ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting a profile by its ID
 * Following the Clean Architecture pattern and SOLID principles
 */
export class GetProfileByIdUseCase implements IUseCase<string, ProfileDto | null> {
  constructor(
    private profileAdapter: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to get a profile by its ID
   * @param id Profile ID
   * @returns ProfileDto or null if not found
   */
  async execute(id: string): Promise<ProfileDto | null> {
    try {
      return await this.profileAdapter.getById(id);
    } catch (error) {
      this.logger?.error('Error getting profile by ID', error, { profileId: id });
      return null;
    }
  }
}
