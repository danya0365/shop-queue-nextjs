
import type { CustomersDataDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { IGetCustomersUseCase } from '@/src/application/usecases/backend/customers/GetCustomersUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendCustomersService {
  getCustomersData(): Promise<CustomersDataDTO>;
}

export class BackendCustomersService implements IBackendCustomersService {
  constructor(
    private readonly getCustomersUseCase: IGetCustomersUseCase,
    private readonly logger: Logger
  ) { }

  async getCustomersData(): Promise<CustomersDataDTO> {
    try {
      this.logger.info('BackendCustomersService: Getting customers data');

      const customersData = await this.getCustomersUseCase.execute();

      this.logger.info('BackendCustomersService: Successfully retrieved customers data');
      return customersData;
    } catch (error) {
      this.logger.error('BackendCustomersService: Error getting customers data', error);
      throw error;
    }
  }
}
