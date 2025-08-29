
import type { ShopsDataDTO } from '@/src/application/dtos/backend/ShopsDTO';
import type { IGetShopsUseCase } from '@/src/application/usecases/backend/shops/GetShopsUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendShopsService {
  getShopsData(): Promise<ShopsDataDTO>;
}

export class BackendShopsService implements IBackendShopsService {
  constructor(
    private readonly getShopsUseCase: IGetShopsUseCase,
    private readonly logger: Logger
  ) { }

  async getShopsData(): Promise<ShopsDataDTO> {
    try {
      this.logger.info('BackendShopsService: Getting shops data');

      const shopsData = await this.getShopsUseCase.execute();

      this.logger.info('BackendShopsService: Successfully retrieved shops data');
      return shopsData;
    } catch (error) {
      this.logger.error('BackendShopsService: Error getting shops data', error);
      throw error;
    }
  }
}
