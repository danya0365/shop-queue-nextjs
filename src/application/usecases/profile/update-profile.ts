import { z } from 'zod';
import { ProfileDto, UpdateProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Input type for update profile use case
 */
export interface UpdateProfileInput {
  id: string;
  data: UpdateProfileDto;
}

/**
 * Schema for validating input
 */
const updateProfileSchema = z.object({
  id: z.string().uuid({ message: 'Profile ID must be a valid UUID' }),
  data: z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
    avatarUrl: z.string().url({ message: 'Avatar URL must be a valid URL' }).optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Use case for updating a profile
 * Following the Clean Architecture pattern
 */
export class UpdateProfileUseCase implements IUseCase<UpdateProfileInput, ProfileDto | null> {
  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   */
  constructor(private readonly profileAdapter: IProfileRepositoryAdapter) {}

  /**
   * Execute the use case to update a profile
   * @param input Input containing profile ID and data to update
   * @returns Updated profile as DTO or null if not found
   */
  async execute(input: UpdateProfileInput): Promise<ProfileDto | null> {
    // Validate input
    updateProfileSchema.parse(input);
    
    // Update profile
    return this.profileAdapter.update(input.id, input.data);
  }
}
