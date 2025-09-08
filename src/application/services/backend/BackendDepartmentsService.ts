import type { CreateDepartmentDTO, DepartmentDTO, DepartmentsDataDTO, DepartmentStatsDTO, UpdateDepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { CreateDepartmentUseCase, DeleteDepartmentUseCase, GetDepartmentByIdUseCase, GetDepartmentsPaginatedUseCase, GetDepartmentStatsUseCase, UpdateDepartmentUseCase, type GetDepartmentsPaginatedInput, type PaginatedDepartmentsDTO } from '../../usecases/backend/departments';

export interface IBackendDepartmentsService {
  getDepartmentsData(page?: number, perPage?: number): Promise<DepartmentsDataDTO>;
  getDepartmentStats(): Promise<DepartmentStatsDTO>;
  getDepartmentById(id: string): Promise<DepartmentDTO>;
  createDepartment(params: CreateDepartmentDTO): Promise<DepartmentDTO>;
  updateDepartment(id: string, params: UpdateDepartmentDTO): Promise<DepartmentDTO>;
  deleteDepartment(id: string): Promise<boolean>;
}

export class BackendDepartmentsService implements IBackendDepartmentsService {
  constructor(
    private readonly getDepartmentsPaginatedUseCase: IUseCase<GetDepartmentsPaginatedInput, PaginatedDepartmentsDTO>,
    private readonly getDepartmentStatsUseCase: IUseCase<void, DepartmentStatsDTO>,
    private readonly getDepartmentByIdUseCase: IUseCase<string, DepartmentDTO>,
    private readonly createDepartmentUseCase: IUseCase<CreateDepartmentDTO, DepartmentDTO>,
    private readonly updateDepartmentUseCase: IUseCase<UpdateDepartmentDTO, DepartmentDTO>,
    private readonly deleteDepartmentUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get departments data including paginated departments and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Departments data DTO
   */
  async getDepartmentsData(page: number = 1, perPage: number = 10): Promise<DepartmentsDataDTO> {
    try {
      this.logger.info('Getting departments data', { page, perPage });

      // Get departments and stats in parallel
      const [departmentsResult, stats] = await Promise.all([
        this.getDepartmentsPaginatedUseCase.execute({ page, limit: perPage }),
        this.getDepartmentStatsUseCase.execute()
      ]);

      return {
        departments: departmentsResult.data,
        stats,
        totalCount: departmentsResult.pagination.totalItems
      };
    } catch (error) {
      this.logger.error('Error getting departments data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get department statistics
   * @returns Department stats DTO
   */
  async getDepartmentStats(): Promise<DepartmentStatsDTO> {
    try {
      this.logger.info('Getting department stats');

      const stats = await this.getDepartmentStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting department stats', { error });
      throw error;
    }
  }

  /**
   * Get a department by ID
   * @param id Department ID
   * @returns Department DTO
   */
  async getDepartmentById(id: string): Promise<DepartmentDTO> {
    try {
      this.logger.info('Getting department by ID', { id });

      const result = await this.getDepartmentByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting department by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new department
   * @param params Department creation parameters
   * @returns Created department DTO
   */
  async createDepartment(params: CreateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      this.logger.info('Creating department', { params });

      const result = await this.createDepartmentUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating department', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing department
   * @param id Department ID
   * @param params Department update parameters
   * @returns Updated department DTO
   */
  async updateDepartment(id: string, params: UpdateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      this.logger.info('Updating department', { id, params });

      const updateData = { ...params, id };
      const result = await this.updateDepartmentUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating department', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a department
   * @param id Department ID
   * @returns Success flag
   */
  async deleteDepartment(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting department', { id });

      const result = await this.deleteDepartmentUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting department', { error, id });
      throw error;
    }
  }
}

export class BackendDepartmentsServiceFactory {
  static create(repository: BackendDepartmentRepository, logger: Logger): BackendDepartmentsService {
    const getDepartmentsPaginatedUseCase = new GetDepartmentsPaginatedUseCase(repository);
    const getDepartmentStatsUseCase = new GetDepartmentStatsUseCase(repository);
    const getDepartmentByIdUseCase = new GetDepartmentByIdUseCase(repository);
    const createDepartmentUseCase = new CreateDepartmentUseCase(repository);
    const updateDepartmentUseCase = new UpdateDepartmentUseCase(repository);
    const deleteDepartmentUseCase = new DeleteDepartmentUseCase(repository);
    return new BackendDepartmentsService(getDepartmentsPaginatedUseCase, getDepartmentStatsUseCase, getDepartmentByIdUseCase, createDepartmentUseCase, updateDepartmentUseCase, deleteDepartmentUseCase, logger);
  }
}
