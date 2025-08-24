import { ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Schema for validating input
 */
const inputSchema = z.string().min(1, { message: 'User ID is required' });

/**
 * Use case for getting a profile by user ID
 * Following the Clean Architecture pattern
 */
export class GetProfileByUserIdUseCase implements IUseCase<string, ProfileDto | null> {
  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   */
  constructor(private readonly profileAdapter: IProfileRepositoryAdapter) {}

  /**
   * Execute the use case to get a profile by user ID
   * @param userId User ID
   * @returns Profile DTO or null if not found
   */
  async execute(userId: string): Promise<ProfileDto | null> {
    // Validate input
    inputSchema.parse(userId);
    
    // Get profile by user ID
    return this.profileAdapter.getByUserId(userId);
  }
}
