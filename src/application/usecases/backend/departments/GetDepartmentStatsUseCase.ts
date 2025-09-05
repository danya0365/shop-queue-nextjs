import { DepartmentStatsDTO } from '@/src/application/dtos/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/backend/department-mapper';
import type { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { BackendDepartmentError, BackendDepartmentErrorType } from '@/src/domain/repositories/backend/backend-department-repository';

export class GetDepartmentStatsUseCase implements IUseCase<void, DepartmentStatsDTO> {
  constructor(
    private readonly departmentRepository: BackendDepartmentRepository
  ) { }

  async execute(): Promise<DepartmentStatsDTO> {
    try {
      // Get department stats from repository
      const stats = await this.departmentRepository.getDepartmentStats();

      // Use mapper to convert entity to DTO
      return DepartmentMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendDepartmentError) {
        throw error;
      }

      throw new BackendDepartmentError(
        BackendDepartmentErrorType.UNKNOWN,
        'Failed to get department statistics',
        'GetDepartmentStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
