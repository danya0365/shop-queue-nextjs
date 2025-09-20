import { DepartmentStatsDTO } from '@/src/application/dtos/shop/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/shop/backend/department-mapper';
import type { ShopBackendDepartmentRepository } from '@/src/domain/repositories/shop/backend/backend-department-repository';
import { ShopBackendDepartmentError, ShopBackendDepartmentErrorType } from '@/src/domain/repositories/shop/backend/backend-department-repository';

export class GetDepartmentStatsUseCase implements IUseCase<string, DepartmentStatsDTO> {
  constructor(
    private readonly departmentRepository: ShopBackendDepartmentRepository
  ) { }

  async execute(shopId: string): Promise<DepartmentStatsDTO> {
    try {
      // Get department stats from repository
      const stats = await this.departmentRepository.getDepartmentStats(shopId);

      // Use mapper to convert entity to DTO
      return DepartmentMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        'Failed to get department statistics',
        'GetDepartmentStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
