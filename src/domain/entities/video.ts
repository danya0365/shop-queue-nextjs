export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  categoryId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  viewsCount: number;
  likesCount: number;
  durationSeconds?: number;
}

export interface VideoCreate {
  title: string;
  description: string;
  youtubeId: string;
  categoryId: string;
  profileId: string;
  durationSeconds?: number;
}
