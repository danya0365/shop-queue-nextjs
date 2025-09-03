import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export class DeleteProfileUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: string): Promise<boolean> {
    // Validate input
    if (!input) {
      throw new Error('Profile ID is required');
    }

    const success = await this.profileRepository.deleteProfile(input);

    return success;
  }
}
