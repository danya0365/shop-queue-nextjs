export interface Like {
  id: string;
  profileId: string;
  videoId: string;
  createdAt: Date;
}

export interface LikeCreate {
  profileId: string;
  videoId: string;
}
