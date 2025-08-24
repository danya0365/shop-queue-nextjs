import { Logger } from '@/src/domain/interfaces/logger';
import { CreateVideoDto, VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class CreateVideoUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(videoData: CreateVideoDto): Promise<VideoDto> {
    try {
      this.logger?.info('Creating new video', { title: videoData.title, profileId: videoData.profileId });
      const result = await this.videoAdapter.create(videoData);
      this.logger?.debug('Video created successfully', { videoId: result.id });
      return result;
    } catch (error) {
      this.logger?.error('Error creating video', error, { title: videoData.title });
      throw error;
    }
  }
}
