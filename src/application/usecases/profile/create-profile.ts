import { CreateProfileDto, ProfileDto } from '../../dtos/profile-dto';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Schema for validating input
 */
const createProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  avatarUrl: z.string().url({ message: 'Avatar URL must be a valid URL' }).optional(),
  authId: z.string().min(1, { message: 'Auth ID is required' }),
  isActive: z.boolean().optional(),
});

/**
 * Use case for creating a new profile
 * Following the Clean Architecture pattern
 */
export class CreateProfileUseCase implements IUseCase<CreateProfileDto, ProfileDto> {
  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   */
  constructor(private readonly profileAdapter: IProfileRepositoryAdapter) {}

  /**
   * Execute the use case to create a new profile
   * @param profileData Data for the new profile
   * @returns Created profile as DTO
   */
  async execute(profileData: CreateProfileDto): Promise<ProfileDto> {
    // Validate input
    createProfileSchema.parse(profileData);
    
    // Create profile
    return this.profileAdapter.create(profileData);
  }
}
