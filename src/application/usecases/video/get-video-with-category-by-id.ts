import { Logger } from '@/src/domain/interfaces/logger';
import { VideoWithCategoryDto } from '../../dtos/video-dto';
import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { IProfileRepositoryAdapter } from '../../interfaces/profile-repository-adapter.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';
import { GetVideoByIdUseCase } from './get-video-by-id';

export class GetVideoWithCategoryByIdUseCase {
  private getVideoByIdUseCase: GetVideoByIdUseCase;

  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private categoryAdapter?: ICategoryRepositoryAdapter,
    private profileAdapter?: IProfileRepositoryAdapter,
    private logger?: Logger
  ) {
    this.getVideoByIdUseCase = new GetVideoByIdUseCase(videoAdapter, logger);
  }

  async execute(id: string): Promise<VideoWithCategoryDto | null> {
    try {
      // Check if the adapter has the getVideoDetails method
      if (this.videoAdapter.getVideoDetails) {
        const videoDetails = await this.videoAdapter.getVideoDetails(id);
        if (videoDetails) {
          // VideoDetailsDto is compatible with VideoWithCategoryDto since it extends VideoDto and has category and profile
          return videoDetails as unknown as VideoWithCategoryDto;
        }
      }
      
      // Fallback to the original implementation if the repository doesn't have the method
      const video = await this.getVideoByIdUseCase.execute(id);
      
      if (!video) {
        return null;
      }
      
      // Get category if available
      let category = null;
      if (this.categoryAdapter && video.categoryId) {
        try {
          const categoryDto = await this.categoryAdapter.getById(video.categoryId);
          // Use CategoryDto directly
          if (categoryDto) {
            category = categoryDto;
          }
        } catch (error) {
          this.logger?.warn(`Failed to get category for video ${id}`, { videoId: id, error });
        }
      }
      
      let profile = null;
      if (video.profileId && this.profileAdapter) {
        try {
          profile = await this.profileAdapter.getById(video.profileId);
        } catch (error) {
          this.logger?.warn('Failed to fetch profile for video', { videoId: id, error });
        }
      }
      
      return {
        ...video,
        category,
        profile: profile || undefined
      };
    } catch (error) {
      this.logger?.error('Error getting video with category', error, { videoId: id });
      return null;
    }
  }
}
