import type { ServicesDataDTO, ServiceDTO, CreateServiceInputDTO, UpdateServiceInputDTO } from '@/src/application/dtos/backend/services-dto';
import type { GetServicesUseCase } from '@/src/application/use-cases/backend/services/GetServicesUseCase';
import type { GetServiceByIdUseCase } from '@/src/application/use-cases/backend/services/GetServiceByIdUseCase';
import type { CreateServiceUseCase } from '@/src/application/use-cases/backend/services/CreateServiceUseCase';
import type { UpdateServiceUseCase } from '@/src/application/use-cases/backend/services/UpdateServiceUseCase';
import type { DeleteServiceUseCase } from '@/src/application/use-cases/backend/services/DeleteServiceUseCase';
import type { ToggleServiceAvailabilityUseCase } from '@/src/application/use-cases/backend/services/ToggleServiceAvailabilityUseCase';

export interface IBackendServicesService {
  getServicesData(
    page?: number,
    limit?: number,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  ): Promise<ServicesDataDTO>;
  
  getServiceById(id: string): Promise<ServiceDTO | null>;
  createService(input: CreateServiceInputDTO): Promise<ServiceDTO>;
  updateService(input: UpdateServiceInputDTO): Promise<ServiceDTO>;
  deleteService(id: string): Promise<boolean>;
  toggleServiceAvailability(id: string, isAvailable: boolean): Promise<boolean>;
}

export class BackendServicesService implements IBackendServicesService {
  constructor(
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
    private readonly toggleServiceAvailabilityUseCase: ToggleServiceAvailabilityUseCase
  ) {}

  async getServicesData(
    page: number = 1,
    limit: number = 20,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  ): Promise<ServicesDataDTO> {
    return this.getServicesUseCase.execute({
      page,
      limit,
      filters
    });
  }

  async getServiceById(id: string): Promise<ServiceDTO | null> {
    return this.getServiceByIdUseCase.execute(id);
  }

  async createService(input: CreateServiceInputDTO): Promise<ServiceDTO> {
    return this.createServiceUseCase.execute(input);
  }

  async updateService(input: UpdateServiceInputDTO): Promise<ServiceDTO> {
    return this.updateServiceUseCase.execute(input);
  }

  async deleteService(id: string): Promise<boolean> {
    return this.deleteServiceUseCase.execute(id);
  }

  async toggleServiceAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    return this.toggleServiceAvailabilityUseCase.execute(id, isAvailable);
  }
}
