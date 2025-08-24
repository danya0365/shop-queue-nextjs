/**
 * Data Transfer Objects for Video-related operations
 * These DTOs are used to transfer data between layers without exposing domain entities
 */

export interface VideoDto {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  categoryId: string;
  profileId: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  // Fields needed by View components
  youtubeId: string;
  viewsCount: number;
  likesCount: number;
  durationSeconds?: number; // เพิ่ม durationSeconds เป็น optional เพื่อให้สอดคล้องกับการใช้งานใน VideoCard
}

export interface CreateVideoDto {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  categoryId: string;
  profileId: string;
  youtubeId: string; // เพิ่ม youtubeId เพื่อให้สอดคล้องกับการใช้งานใน SubmitVideoForm
}

export interface UpdateVideoDto {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  categoryId?: string;
}

export interface VideoSearchDto {
  query: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface VideoFilterDto {
  categoryId?: string;
  profileId?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

// ใช้ ProfileDto จาก profile-dto.ts แทนการประกาศซ้ำซ้อน
// แต่เพื่อความสะดวกในการใช้งานในไฟล์นี้ จึงประกาศแบบย่อไว้สำหรับการใช้งานใน VideoDto
export interface ProfileDto {
  id: string;
  name: string;
  avatarUrl?: string; // เปลี่ยนเป็น optional เหมือนใน profile-dto.ts
  username: string;
  // ไม่จำเป็นต้องมี field อื่นๆ ที่ไม่ได้ใช้ใน VideoDto
}

export interface VideoWithCategoryDto extends VideoDto {
  category: CategoryDto | null;
  profile?: ProfileDto | null;
}

export interface VideoDetailsDto extends VideoDto {
  category: CategoryDto;
  profile: ProfileDto;
  isLiked?: boolean;
  likeCount: number;
  commentCount: number;
}
