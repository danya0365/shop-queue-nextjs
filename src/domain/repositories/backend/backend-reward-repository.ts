import { CreateRewardEntity, RewardEntity, RewardStatsEntity, RewardTypeStatsEntity, PaginatedRewardsEntity, UpdateRewardEntity, RewardUsageEntity } from "../../entities/backend/backend-reward.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Reward repository error types
 */
export enum BackendRewardErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for reward repository operations
 * Following Clean Architecture principles for error handling
 */
export class BackendRewardError extends Error {
  constructor(
    public readonly type: BackendRewardErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendRewardError';
  }
}

/**
 * Reward repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendRewardRepository {
  /**
   * Get paginated rewards data
   * @param params Pagination parameters
   * @returns Paginated rewards data
   * @throws BackendRewardError if the operation fails
   */
  getPaginatedRewards(params: PaginationParams): Promise<PaginatedRewardsEntity>;

  /**
   * Get reward statistics
   * @returns Reward statistics data
   * @throws BackendRewardError if the operation fails
   */
  getRewardStats(): Promise<RewardStatsEntity>;

  /**
   * Get reward type statistics
   * @returns Reward type statistics data
   * @throws BackendRewardError if the operation fails
   */
  getRewardTypeStats(): Promise<RewardTypeStatsEntity>;

  /**
   * Get recent reward usage
   * @param limit Number of recent usage records to fetch
   * @returns Array of reward usage entities
   * @throws BackendRewardError if the operation fails
   */
  getRecentRewardUsage(limit?: number): Promise<RewardUsageEntity[]>;

  /**
   * Get reward by ID
   * @param id Reward ID
   * @returns Reward entity or null if not found
   * @throws BackendRewardError if the operation fails
   */
  getRewardById(id: string): Promise<RewardEntity | null>;

  /**
   * Create a new reward
   * @param reward Reward data to create
   * @returns Created reward entity
   * @throws BackendRewardError if the operation fails
   */
  createReward(reward: Omit<CreateRewardEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RewardEntity>;

  /**
   * Update an existing reward
   * @param id Reward ID
   * @param reward Reward data to update
   * @returns Updated reward entity
   * @throws BackendRewardError if the operation fails
   */
  updateReward(id: string, reward: Partial<Omit<UpdateRewardEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RewardEntity>;

  /**
   * Delete a reward
   * @param id Reward ID
   * @returns true if deleted successfully
   * @throws BackendRewardError if the operation fails
   */
  deleteReward(id: string): Promise<boolean>;
}
