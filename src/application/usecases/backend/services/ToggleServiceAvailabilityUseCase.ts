import type { BackendServiceRepository } from '@/src/domain/interfaces/backend/BackendServiceRepository';
import type { Logger } from '@/src/domain/interfaces/logger';

export class ToggleServiceAvailabilityUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) {}

  async execute(id: string, isAvailable: boolean): Promise<boolean> {
    try {
      this.logger.info('ToggleServiceAvailabilityUseCase: Toggling service availability', { 
        id, 
        isAvailable 
      });

      const success = await this.serviceRepository.toggleAvailability(id, isAvailable);

      if (success) {
        this.logger.info('ToggleServiceAvailabilityUseCase: Successfully toggled service availability', { 
          id, 
          isAvailable 
        });
      } else {
        this.logger.warn('ToggleServiceAvailabilityUseCase: Failed to toggle service availability', { 
          id, 
          isAvailable 
        });
      }

      return success;
    } catch (error) {
      this.logger.error('ToggleServiceAvailabilityUseCase: Error toggling service availability', error);
      throw error;
    }
  }
}
