import { Logger } from '@/src/domain/interfaces/logger';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class IncrementVideoViewsUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      await this.videoAdapter.incrementViews(id);
      return true;
    } catch (error) {
      this.logger?.error('Error incrementing video views', error, { videoId: id });
      return false;
    }
  }
}
