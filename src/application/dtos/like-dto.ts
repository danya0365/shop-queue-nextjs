import { z } from 'zod';

/**
 * Data Transfer Object for Like entity
 * Used for communication between application and presentation layers
 */
export interface LikeDto {
  id: string;
  profileId: string;
  videoId: string;
  createdAt: string; // ISO date string format
}

/**
 * Data Transfer Object for creating a like
 * Used as input for like creation use cases
 */
export interface CreateLikeInputDto {
  profileId: string;
  videoId: string;
}

/**
 * Data Transfer Object for like toggle response
 * Contains information about the like status and count
 */
export interface LikeToggleResponseDto {
  liked: boolean;
  likesCount: number;
}

/**
 * Zod schema for validating CreateLikeInputDto
 */
export const createLikeInputSchema = z.object({
  profileId: z.string().uuid({ message: 'Profile ID must be a valid UUID' }),
  videoId: z.string().uuid({ message: 'Video ID must be a valid UUID' }),
});

/**
 * Type for validated CreateLikeInputDto
 */
export type ValidatedCreateLikeInputDto = z.infer<typeof createLikeInputSchema>;
