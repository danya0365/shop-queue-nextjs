import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface DeleteProfileUseCaseInput {
  id: string;
}

export interface DeleteProfileUseCaseOutput {
  success: boolean;
}

export interface IDeleteProfileUseCase {
  execute(input: DeleteProfileUseCaseInput): Promise<DeleteProfileUseCaseOutput>;
}

export class DeleteProfileUseCase implements IDeleteProfileUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: DeleteProfileUseCaseInput): Promise<DeleteProfileUseCaseOutput> {
    const { id } = input;

    // Validate input
    if (!id) {
      throw new Error('Profile ID is required');
    }

    const success = await this.profileRepository.deleteProfile(id);

    return {
      success
    };
  }
}
