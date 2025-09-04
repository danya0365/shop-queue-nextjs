import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/backend-service-repository';

export interface ToggleServiceAvailabilityUseCaseInput {
  id: string;
  isAvailable: boolean;
}

export class ToggleServiceAvailabilityUseCase implements IUseCase<ToggleServiceAvailabilityUseCaseInput, boolean> {
  constructor(
    private readonly serviceRepository: BackendServiceRepository
  ) { }

  async execute(input: ToggleServiceAvailabilityUseCaseInput): Promise<boolean> {
    if (!input.id) {
      throw new Error('Service ID is required');
    }

    return await this.serviceRepository.toggleAvailability(input.id, input.isAvailable);
  }
}
