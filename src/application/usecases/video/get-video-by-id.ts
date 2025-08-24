import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class GetVideoByIdUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(id: string): Promise<VideoDto | null> {
    try {
      return await this.videoAdapter.getById(id);
    } catch (error) {
      this.logger?.error('Error getting video by ID', error, { videoId: id });
      return null;
    }
  }
}
