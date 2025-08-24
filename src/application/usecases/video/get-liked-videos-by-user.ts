import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class GetLikedVideosByUserUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(profileId: string): Promise<VideoDto[]> {
    try {
      return await this.videoAdapter.getLikedByUser(profileId);
    } catch (error) {
      this.logger?.error('Error getting liked videos by user', error, { profileId });
      return [];
    }
  }
}
