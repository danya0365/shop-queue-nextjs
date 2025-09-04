import type { BackendServiceRepository } from '@/src/domain/interfaces/backend/BackendServiceRepository';
import type { Logger } from '@/src/domain/interfaces/logger';

export class DeleteServiceUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      this.logger.info('DeleteServiceUseCase: Deleting service', { id });

      const success = await this.serviceRepository.deleteService(id);

      if (success) {
        this.logger.info('DeleteServiceUseCase: Successfully deleted service', { id });
      } else {
        this.logger.warn('DeleteServiceUseCase: Failed to delete service', { id });
      }

      return success;
    } catch (error) {
      this.logger.error('DeleteServiceUseCase: Error deleting service', error);
      throw error;
    }
  }
}
