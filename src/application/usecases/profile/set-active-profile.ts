import { Logger } from '@/src/domain/interfaces/logger';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface SetActiveProfileInput {
  profileId: string;
  authId: string;
}

/**
 * Use case for setting a profile as active
 * Following the Clean Architecture pattern and SOLID principles
 */
export class SetActiveProfileUseCase implements IUseCase<SetActiveProfileInput, boolean> {
  constructor(
    private profileAdapter: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to set a profile as active
   * @param input Object containing profileId and authId
   * @returns Boolean indicating success
   */
  async execute(input: SetActiveProfileInput): Promise<boolean> {
    const { profileId, authId } = input;
    try {
      await this.profileAdapter.setActive(profileId, authId);
      return true;
    } catch (error) {
      this.logger?.error('Error setting active profile', error, { profileId, authId });
      return false;
    }
  }
}
