import { ILikeRepositoryAdapter } from '../interfaces/like-repository-adapter.interface';
import { ToggleLikeUseCase } from '../usecases/like/toggle-like';
import { GetLikeStatusUseCase } from '../usecases/like/get-like-status';
import { GetLikesByUserUseCase } from '../usecases/like/get-likes-by-user';
import { GetLikesByVideoUseCase } from '../usecases/like/get-likes-by-video';
import { GetLikeCountUseCase } from '../usecases/like/get-like-count';

/**
 * Factory for creating like use cases
 * Following Factory Pattern to centralize creation logic
 */
export class LikeUseCaseFactory {
  /**
   * Create a ToggleLikeUseCase instance
   */
  static createToggleLikeUseCase(likeAdapter: ILikeRepositoryAdapter): ToggleLikeUseCase {
    return new ToggleLikeUseCase(likeAdapter);
  }

  /**
   * Create a GetLikeStatusUseCase instance
   */
  static createGetLikeStatusUseCase(likeAdapter: ILikeRepositoryAdapter): GetLikeStatusUseCase {
    return new GetLikeStatusUseCase(likeAdapter);
  }

  /**
   * Create a GetLikesByUserUseCase instance
   */
  static createGetLikesByUserUseCase(likeAdapter: ILikeRepositoryAdapter): GetLikesByUserUseCase {
    return new GetLikesByUserUseCase(likeAdapter);
  }

  /**
   * Create a GetLikesByVideoUseCase instance
   */
  static createGetLikesByVideoUseCase(likeAdapter: ILikeRepositoryAdapter): GetLikesByVideoUseCase {
    return new GetLikesByVideoUseCase(likeAdapter);
  }

  /**
   * Create a GetLikeCountUseCase instance
   */
  static createGetLikeCountUseCase(likeAdapter: ILikeRepositoryAdapter): GetLikeCountUseCase {
    return new GetLikeCountUseCase(likeAdapter);
  }
}
