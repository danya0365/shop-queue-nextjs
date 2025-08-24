import { Logger } from '@/src/domain/interfaces/logger';
import { CategoryDto, ProfileDto, VideoDetailsDto } from '../../dtos/video-dto';
import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';
import { GetVideoWithCategoryByIdUseCase } from './get-video-with-category-by-id';

export class GetVideoDetailsUseCase {
  private getVideoWithCategoryByIdUseCase: GetVideoWithCategoryByIdUseCase;

  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private categoryAdapter?: ICategoryRepositoryAdapter,
    private profileAdapter?: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {
    this.getVideoWithCategoryByIdUseCase = new GetVideoWithCategoryByIdUseCase(
      videoAdapter,
      categoryAdapter,
      profileAdapter,
      logger
    );
  }

  async execute(id: string): Promise<VideoDetailsDto | null> {
    try {
      // Check if the adapter has the getVideoDetails method
      if (this.videoAdapter.getVideoDetails) {
        // Use the optional method if available
        const details = await this.videoAdapter.getVideoDetails(id);
        return details;
      }
      
      // Fallback to the original implementation
      const videoWithCategory = await this.getVideoWithCategoryByIdUseCase.execute(id);
      if (!videoWithCategory) {
        return null;
      }
      
      // Get category if available
      if (this.categoryAdapter && videoWithCategory.categoryId) {
        try {
          const categoryDto = await this.categoryAdapter.getById(videoWithCategory.categoryId);
          // Use CategoryDto directly
          if (categoryDto) {
            videoWithCategory.category = categoryDto;
          }
        } catch (error) {
          this.logger?.warn(`Failed to get category for video ${id}`, { videoId: id, error });
        }
      }

      // We don't have like status in the fallback implementation
      // Create a proper VideoDetailsDto with all required fields
      // Ensure category and profile are non-null as required by VideoDetailsDto
      const defaultCategory: CategoryDto = videoWithCategory.category || {
        id: videoWithCategory.categoryId || '',
        name: 'Unknown Category',
        slug: 'unknown-category'
      };
      
      const defaultProfile: ProfileDto = videoWithCategory.profile || {
        id: videoWithCategory.profileId || '',
        name: 'Unknown User',
        avatarUrl: '',
        username: 'unknown_user' // เพิ่ม field username ตามที่เพิ่มใน ProfileDto
      };
      
      return {
        ...videoWithCategory,
        category: defaultCategory,
        profile: defaultProfile,
        isLiked: false,
        likeCount: 0,
        commentCount: 0
      };
    } catch (error) {
      this.logger?.error('Error getting video details', error, { videoId: id });
      return null;
    }
  }
}
