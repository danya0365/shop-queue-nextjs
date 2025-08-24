import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { IUseCase } from '../../interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export interface SearchVideosInput {
  query: string;
  categoryId?: string;
}

export class SearchVideosUseCase implements IUseCase<SearchVideosInput, VideoDto[]> {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(input?: SearchVideosInput): Promise<VideoDto[]> {
    if (!input) {
      return [];
    }
    
    const { query, categoryId } = input;
    try {
      return await this.videoAdapter.search(query, categoryId);
    } catch (error) {
      this.logger?.error('Error searching videos', error, { query, categoryId });
      return [];
    }
  }
}
