import type { CreateRewardDTO, RewardDTO, RewardsDataDTO, RewardStatsDTO, UpdateRewardDTO } from '@/src/application/dtos/backend/reward-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { GetRewardsPaginatedInput, GetRewardsPaginatedUseCase } from '@/src/application/usecases/backend/rewards/GetRewardsPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { CreateRewardUseCase } from '../../usecases/backend/rewards/CreateRewardUseCase';
import { DeleteRewardUseCase } from '../../usecases/backend/rewards/DeleteRewardUseCase';
import { GetRewardByIdUseCase } from '../../usecases/backend/rewards/GetRewardByIdUseCase';
import { GetRewardStatsUseCase } from '../../usecases/backend/rewards/GetRewardStatsUseCase';
import { UpdateRewardUseCase } from '../../usecases/backend/rewards/UpdateRewardUseCase';

export interface IBackendRewardsService {
  getRewardsData(page?: number, perPage?: number): Promise<RewardsDataDTO>;
  getRewardStats(): Promise<RewardStatsDTO>;
  getRewardById(id: string): Promise<RewardDTO>;
  createReward(params: CreateRewardDTO): Promise<RewardDTO>;
  updateReward(id: string, params: Omit<UpdateRewardDTO, 'id'>): Promise<RewardDTO>;
  deleteReward(id: string): Promise<boolean>;
}

export class BackendRewardsService implements IBackendRewardsService {
  constructor(
    private readonly getRewardsPaginatedUseCase: IUseCase<GetRewardsPaginatedInput, RewardsDataDTO>,
    private readonly getRewardStatsUseCase: IUseCase<void, RewardStatsDTO>,
    private readonly getRewardByIdUseCase: IUseCase<string, RewardDTO>,
    private readonly createRewardUseCase: IUseCase<CreateRewardDTO, RewardDTO>,
    private readonly updateRewardUseCase: IUseCase<UpdateRewardDTO, RewardDTO>,
    private readonly deleteRewardUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get rewards data including paginated rewards and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Rewards data DTO
   */
  async getRewardsData(page: number = 1, perPage: number = 10): Promise<RewardsDataDTO> {
    try {
      this.logger.info('Getting rewards data', { page, perPage });

      const result = await this.getRewardsPaginatedUseCase.execute({ page, limit: perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting rewards data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get reward statistics
   * @returns Reward stats DTO
   */
  async getRewardStats(): Promise<RewardStatsDTO> {
    try {
      this.logger.info('Getting reward stats');

      const stats = await this.getRewardStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting reward stats', { error });
      throw error;
    }
  }

  /**
   * Get a reward by ID
   * @param id Reward ID
   * @returns Reward DTO
   */
  async getRewardById(id: string): Promise<RewardDTO> {
    try {
      this.logger.info('Getting reward by ID', { id });

      const result = await this.getRewardByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting reward by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new reward
   * @param params Reward creation parameters
   * @returns Created reward DTO
   */
  async createReward(params: CreateRewardDTO): Promise<RewardDTO> {
    try {
      this.logger.info('Creating reward', { params });

      const result = await this.createRewardUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating reward', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing reward
   * @param id Reward ID
   * @param params Reward update parameters
   * @returns Updated reward DTO
   */
  async updateReward(id: string, params: Omit<UpdateRewardDTO, 'id'>): Promise<RewardDTO> {
    try {
      this.logger.info('Updating reward', { id, params });

      const updateData = { ...params, id };
      const result = await this.updateRewardUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating reward', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a reward
   * @param id Reward ID
   * @returns Success flag
   */
  async deleteReward(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting reward', { id });

      const result = await this.deleteRewardUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting reward', { error, id });
      throw error;
    }
  }
}

export class BackendRewardsServiceFactory {
  static create(repository: BackendRewardRepository, logger: Logger): BackendRewardsService {
    const getRewardsPaginatedUseCase = new GetRewardsPaginatedUseCase(repository);
    const getRewardStatsUseCase = new GetRewardStatsUseCase(repository);
    const getRewardByIdUseCase = new GetRewardByIdUseCase(repository);
    const createRewardUseCase = new CreateRewardUseCase(repository);
    const updateRewardUseCase = new UpdateRewardUseCase(repository);
    const deleteRewardUseCase = new DeleteRewardUseCase(repository);
    return new BackendRewardsService(getRewardsPaginatedUseCase, getRewardStatsUseCase, getRewardByIdUseCase, createRewardUseCase, updateRewardUseCase, deleteRewardUseCase, logger);
  }
}

