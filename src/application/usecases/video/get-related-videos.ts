import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { VideoUseCaseFactory } from '../../factories/video-use-case.factory';
import { IUseCase } from '../../interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export interface GetRelatedVideosInput {
  videoId: string;
  limit?: number;
}

export class GetRelatedVideosUseCase implements IUseCase<GetRelatedVideosInput, VideoDto[]> {
  private getVideoByIdUseCase: IUseCase<string, VideoDto | null>;

  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {
    this.getVideoByIdUseCase = VideoUseCaseFactory.createGetVideoByIdUseCase(videoAdapter);
  }

  async execute(input?: GetRelatedVideosInput): Promise<VideoDto[]> {
    if (!input) {
      return [];
    }
    
    const { videoId, limit } = input;
    try {
      // Check if the adapter has the getRelatedVideos method
      if (this.videoAdapter.getRelatedVideos) {
        // Use the optional method if available
        return await this.videoAdapter.getRelatedVideos(videoId, limit);
      }
      
      // Fallback to the original implementation if the repository doesn't have the method
      const video = await this.getVideoByIdUseCase.execute(videoId);
      
      if (!video || !video.categoryId) {
        return [];
      }
      
      // Get videos from the same category
      const categoryVideos = await this.videoAdapter.getPaginatedVideosByCategory(video.categoryId, { limit: limit || 10, page: 1 });
      
      // Filter out the current video
      const relatedVideos = categoryVideos.data.filter(v => v.id !== videoId);
      
      // Return limited number if specified
      return limit ? relatedVideos.slice(0, limit) : relatedVideos;
    } catch (error) {
      this.logger?.error('Error getting related videos', error, { videoId, limit });
      return [];
    }
  }
}
