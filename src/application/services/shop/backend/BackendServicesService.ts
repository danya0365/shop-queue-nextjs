import type {
  CreateServiceInputDTO,
  PaginatedServicesDTO,
  ServiceDTO,
  ServiceStatsDTO,
  ServicesDataDTO,
  UpdateServiceInputDTO,
} from "@/src/application/dtos/shop/backend/services-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import {
  CreateServiceUseCase,
  DeleteServiceUseCase,
  GetServiceByIdUseCase,
  GetServiceStatsUseCase,
  UpdateServiceUseCase,
} from "@/src/application/usecases/shop/backend/services";
import {
  GetServicesPaginatedUseCase,
  type GetServicesPaginatedUseCaseInput,
} from "@/src/application/usecases/shop/backend/services/GetServicesPaginatedUseCase";
import {
  ToggleServiceAvailabilityUseCase,
  type ToggleServiceAvailabilityUseCaseInput,
} from "@/src/application/usecases/shop/backend/services/ToggleServiceAvailabilityUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendServiceRepository } from "@/src/domain/repositories/shop/backend/backend-service-repository";

export interface IShopBackendServicesService {
  getServicesData(
    page?: number,
    perPage?: number,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  ): Promise<ServicesDataDTO>;
  getServiceById(id: string): Promise<ServiceDTO | null>;
  createService(serviceData: CreateServiceInputDTO): Promise<ServiceDTO>;
  updateService(
    id: string,
    serviceData: Omit<UpdateServiceInputDTO, "id">
  ): Promise<ServiceDTO>;
  deleteService(id: string): Promise<boolean>;
  toggleServiceAvailability(id: string, isAvailable: boolean): Promise<boolean>;
}

export class ShopBackendServicesService implements IShopBackendServicesService {
  constructor(
    private readonly getServicesPaginatedUseCase: IUseCase<
      GetServicesPaginatedUseCaseInput,
      PaginatedServicesDTO
    >,
    private readonly getServiceStatsUseCase: IUseCase<string, ServiceStatsDTO>,
    private readonly getServiceByIdUseCase: IUseCase<string, ServiceDTO | null>,
    private readonly createServiceUseCase: IUseCase<
      CreateServiceInputDTO,
      ServiceDTO
    >,
    private readonly updateServiceUseCase: IUseCase<
      UpdateServiceInputDTO,
      ServiceDTO
    >,
    private readonly deleteServiceUseCase: IUseCase<string, boolean>,
    private readonly toggleServiceAvailabilityUseCase: IUseCase<
      ToggleServiceAvailabilityUseCaseInput,
      boolean
    >,
    private readonly logger: Logger
  ) {}

  /**
   * Get services data including paginated services and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 20)
   * @param filters Optional filters
   * @returns Services data DTO
   */
  async getServicesData(
    page: number = 1,
    perPage: number = 20,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
      shopId?: string;
    }
  ): Promise<ServicesDataDTO> {
    try {
      this.logger.info("Getting services data", { page, perPage, filters });

      // Get services and stats in parallel
      const [servicesResult, stats] = await Promise.all([
        this.getServicesPaginatedUseCase.execute({ page, perPage, filters }),
        this.getServiceStatsUseCase.execute(filters?.shopId),
      ]);

      return {
        services: servicesResult.data,
        stats,
        totalCount: servicesResult.pagination.totalItems,
        currentPage: servicesResult.pagination.currentPage,
        perPage: servicesResult.pagination.itemsPerPage,
      };
    } catch (error) {
      this.logger.error("Error getting services data", {
        error,
        page,
        perPage,
        filters,
      });
      throw error;
    }
  }

  /**
   * Get a service by ID
   * @param id Service ID
   * @returns Service DTO or null if not found
   */
  async getServiceById(id: string): Promise<ServiceDTO | null> {
    try {
      this.logger.info("Getting service by ID", { id });

      const result = await this.getServiceByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error("Error getting service by ID", { error, id });
      throw error;
    }
  }

  /**
   * Create a new service
   * @param serviceData Service data
   * @returns Created service DTO
   */
  async createService(serviceData: CreateServiceInputDTO): Promise<ServiceDTO> {
    try {
      this.logger.info("Creating service", { serviceData });

      const result = await this.createServiceUseCase.execute(serviceData);
      return result;
    } catch (error) {
      this.logger.error("Error creating service", { error, serviceData });
      throw error;
    }
  }

  /**
   * Update an existing service
   * @param id Service ID
   * @param serviceData Service data to update
   * @returns Updated service DTO
   */
  async updateService(
    id: string,
    serviceData: Omit<UpdateServiceInputDTO, "id">
  ): Promise<ServiceDTO> {
    try {
      this.logger.info("Updating service", { id, serviceData });

      const updateData = { id, ...serviceData };
      const result = await this.updateServiceUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error("Error updating service", { error, id, serviceData });
      throw error;
    }
  }

  /**
   * Delete a service
   * @param id Service ID
   * @returns Success flag
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      this.logger.info("Deleting service", { id });

      const result = await this.deleteServiceUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error("Error deleting service", { error, id });
      throw error;
    }
  }

  /**
   * Toggle service availability
   * @param id Service ID
   * @param isAvailable Availability flag
   * @returns Success flag
   */
  async toggleServiceAvailability(
    id: string,
    isAvailable: boolean
  ): Promise<boolean> {
    try {
      this.logger.info("Toggling service availability", { id, isAvailable });

      const result = await this.toggleServiceAvailabilityUseCase.execute({
        id,
        isAvailable,
      });
      return result;
    } catch (error) {
      this.logger.error("Error toggling service availability", {
        error,
        id,
        isAvailable,
      });
      throw error;
    }
  }
}

export class ShopBackendServicesServiceFactory {
  static create(
    repository: ShopBackendServiceRepository,
    logger: Logger
  ): ShopBackendServicesService {
    const getServicesPaginatedUseCase = new GetServicesPaginatedUseCase(
      repository
    );
    const getServiceStatsUseCase = new GetServiceStatsUseCase(repository);
    const getServiceByIdUseCase = new GetServiceByIdUseCase(repository);
    const createServiceUseCase = new CreateServiceUseCase(repository);
    const updateServiceUseCase = new UpdateServiceUseCase(repository);
    const deleteServiceUseCase = new DeleteServiceUseCase(repository);
    const toggleServiceAvailabilityUseCase =
      new ToggleServiceAvailabilityUseCase(repository);
    return new ShopBackendServicesService(
      getServicesPaginatedUseCase,
      getServiceStatsUseCase,
      getServiceByIdUseCase,
      createServiceUseCase,
      updateServiceUseCase,
      deleteServiceUseCase,
      toggleServiceAvailabilityUseCase,
      logger
    );
  }
}
