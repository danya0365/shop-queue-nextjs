import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendServiceRepository } from '@/src/domain/repositories/shop/backend/backend-service-repository';

export class DeleteServiceUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Service ID is required');
    }

    return await this.serviceRepository.deleteService(id);
  }
}
