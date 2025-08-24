/**
 * Database schema for likes
 */
export interface LikeDbSchema extends Record<string, unknown> {
  id: string;
  profile_id: string;
  video_id: string;
  created_at: string;
}
