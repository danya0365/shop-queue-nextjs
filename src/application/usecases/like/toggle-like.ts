import { LikeValidationException } from '../../exceptions/like-exceptions';
import { ILikeRepositoryAdapter } from '../../interfaces/like-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { CreateLikeInputDto, createLikeInputSchema, LikeToggleResponseDto } from '../../dtos/like-dto';

/**
 * Use case for toggling like status on a video
 * Following SOLID principles and Clean Architecture
 */
export class ToggleLikeUseCase implements IUseCase<CreateLikeInputDto, LikeToggleResponseDto> {
  /**
   * Constructor with dependency injection
   * @param likeAdapter Repository adapter for like operations
   */
  constructor(private readonly likeAdapter: ILikeRepositoryAdapter) {}

  /**
   * Execute the use case
   * @param input DTO containing profile ID and video ID
   * @returns Object containing like status and count
   * @throws LikeValidationException if input validation fails
   */
  async execute(input: CreateLikeInputDto): Promise<LikeToggleResponseDto> {
    // Validate input using zod schema
    const validationResult = createLikeInputSchema.safeParse(input);
    if (!validationResult.success) {
      throw new LikeValidationException(validationResult.error.format());
    }
    
    // Use adapter to toggle like and get updated like status
    return await this.likeAdapter.toggleLike(input);
  }
}
