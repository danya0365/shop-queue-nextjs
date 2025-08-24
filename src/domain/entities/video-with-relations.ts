import { Category } from './category';
import { Video } from './video';
import { Profile } from './profile';

export interface VideoWithCategory extends Video {
  category: Category | null;
  profile?: Profile;
}

export interface VideoWithDetails extends VideoWithCategory {
  isLiked: boolean;
}
