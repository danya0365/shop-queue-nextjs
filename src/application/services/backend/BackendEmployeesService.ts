
import type { EmployeesDataDTO } from '@/src/application/dtos/backend/EmployeesDTO';
import type { IGetEmployeesUseCase } from '@/src/application/usecases/backend/employees/GetEmployeesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendEmployeesService {
  getEmployeesData(): Promise<EmployeesDataDTO>;
}

export class BackendEmployeesService implements IBackendEmployeesService {
  constructor(
    private readonly getEmployeesUseCase: IGetEmployeesUseCase,
    private readonly logger: Logger
  ) { }

  async getEmployeesData(): Promise<EmployeesDataDTO> {
    try {
      this.logger.info('BackendEmployeesService: Getting employees data');

      const employeesData = await this.getEmployeesUseCase.execute();

      this.logger.info('BackendEmployeesService: Successfully retrieved employees data');
      return employeesData;
    } catch (error) {
      this.logger.error('BackendEmployeesService: Error getting employees data', error);
      throw error;
    }
  }
}
