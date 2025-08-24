import { Logger } from '@/src/domain/interfaces/logger';
import { ICategoryRepositoryAdapter } from '../interfaces/category-repository-adapter.interface';
import { IProfileRepositoryAdapter } from '../interfaces/profile-repository-adapter.interface';
import { IVideoRepositoryAdapter } from '../interfaces/video-repository-adapter.interface';

import { CreateVideoUseCase } from '../usecases/video/create-video';
import { GetLikedVideosByUserUseCase } from '../usecases/video/get-liked-videos-by-user';
import { GetPaginatedLikedVideosByUserUseCase } from '../usecases/video/get-paginated-liked-videos-by-user';
import { GetPaginatedPopularVideosUseCase } from '../usecases/video/get-paginated-popular-videos';
import { GetPaginatedRecentVideosUseCase } from '../usecases/video/get-paginated-recent-videos';
import { GetPaginatedVideosByCategoryUseCase } from '../usecases/video/get-paginated-videos-by-category';
import { GetPaginatedVideosByUserUseCase } from '../usecases/video/get-paginated-videos-by-user';
import { GetRelatedVideosUseCase } from '../usecases/video/get-related-videos';
import { GetVideoByIdUseCase } from '../usecases/video/get-video-by-id';
import { GetVideoDetailsUseCase } from '../usecases/video/get-video-details';
import { GetVideoWithCategoryByIdUseCase } from '../usecases/video/get-video-with-category-by-id';
import {
  GetMostLikedVideosUseCase,
  GetPopularVideosUseCase,
  GetRecentVideosUseCase,
  GetVideosUseCase
} from '../usecases/video/get-videos';
import { GetVideosByCategoryUseCase } from '../usecases/video/get-videos-by-category';
import { GetVideosByUserUseCase } from '../usecases/video/get-videos-by-user';
import { IncrementVideoViewsUseCase } from '../usecases/video/increment-video-views';
import { SearchVideosUseCase } from '../usecases/video/search-videos';

/**
 * Factory for creating video use cases
 * Following Factory Pattern to centralize creation logic
 */
export class VideoUseCaseFactory {
  /**
   * Create a GetVideosUseCase instance
   */
  static createGetVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetVideosUseCase {
    return new GetVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetRecentVideosUseCase instance
   */
  static createGetRecentVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetRecentVideosUseCase {
    return new GetRecentVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPopularVideosUseCase instance
   */
  static createGetPopularVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPopularVideosUseCase {
    return new GetPopularVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetMostLikedVideosUseCase instance
   */
  static createGetMostLikedVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetMostLikedVideosUseCase {
    return new GetMostLikedVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetVideoByIdUseCase instance
   */
  static createGetVideoByIdUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetVideoByIdUseCase {
    return new GetVideoByIdUseCase(videoAdapter, logger);
  }

  /**
   * Create a CreateVideoUseCase instance
   */
  static createCreateVideoUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): CreateVideoUseCase {
    return new CreateVideoUseCase(videoAdapter, logger);
  }

  /**
   * Create an IncrementVideoViewsUseCase instance
   */
  static createIncrementVideoViewsUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): IncrementVideoViewsUseCase {
    return new IncrementVideoViewsUseCase(videoAdapter, logger);
  }



  /**
   * Create a GetVideosByCategoryUseCase instance
   */
  static createGetVideosByCategoryUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetVideosByCategoryUseCase {
    return new GetVideosByCategoryUseCase(videoAdapter, logger);
  }

  /**
   * Create a SearchVideosUseCase instance
   */
  static createSearchVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): SearchVideosUseCase {
    return new SearchVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetVideosByUserUseCase instance
   */
  static createGetVideosByUserUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetVideosByUserUseCase {
    return new GetVideosByUserUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPaginatedVideosByUserUseCase instance
   */
  static createGetPaginatedVideosByUserUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPaginatedVideosByUserUseCase {
    return new GetPaginatedVideosByUserUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetLikedVideosByUserUseCase instance
   */
  static createGetLikedVideosByUserUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetLikedVideosByUserUseCase {
    return new GetLikedVideosByUserUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPaginatedLikedVideosByUserUseCase instance
   */
  static createGetPaginatedLikedVideosByUserUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPaginatedLikedVideosByUserUseCase {
    return new GetPaginatedLikedVideosByUserUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPaginatedPopularVideosUseCase instance
   */
  static createGetPaginatedPopularVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPaginatedPopularVideosUseCase {
    return new GetPaginatedPopularVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPaginatedRecentVideosUseCase instance
   */
  static createGetPaginatedRecentVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPaginatedRecentVideosUseCase {
    return new GetPaginatedRecentVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetPaginatedVideosByCategoryUseCase instance
   */
  static createGetPaginatedVideosByCategoryUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetPaginatedVideosByCategoryUseCase {
    return new GetPaginatedVideosByCategoryUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetRelatedVideosUseCase instance
   */
  static createGetRelatedVideosUseCase(videoAdapter: IVideoRepositoryAdapter, logger?: Logger): GetRelatedVideosUseCase {
    return new GetRelatedVideosUseCase(videoAdapter, logger);
  }

  /**
   * Create a GetVideoWithCategoryByIdUseCase instance
   */
  static createGetVideoWithCategoryByIdUseCase(
    videoAdapter: IVideoRepositoryAdapter,
    categoryAdapter: ICategoryRepositoryAdapter,
    profileAdapter: IProfileRepositoryAdapter,
    logger?: Logger
  ): GetVideoWithCategoryByIdUseCase {
    return new GetVideoWithCategoryByIdUseCase(
      videoAdapter,
      categoryAdapter,
      profileAdapter,
      logger
    );
  }

  /**
   * Create a GetVideoDetailsUseCase instance
   */
  static createGetVideoDetailsUseCase(
    videoAdapter: IVideoRepositoryAdapter,
    categoryAdapter: ICategoryRepositoryAdapter,
    profileAdapter: IProfileRepositoryAdapter,
    logger?: Logger
  ): GetVideoDetailsUseCase {
    return new GetVideoDetailsUseCase(
      videoAdapter,
      categoryAdapter,
      profileAdapter,
      logger
    );
  }
}
