import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class GetVideosByUserUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(profileId: string): Promise<VideoDto[]> {
    try {
      return await this.videoAdapter.getByUser(profileId);
    } catch (error) {
      this.logger?.error('Error getting videos by user', error, { profileId });
      return [];
    }
  }
}
