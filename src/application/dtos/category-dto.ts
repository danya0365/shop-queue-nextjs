import { z } from 'zod';

/**
 * Input DTO for creating a category
 */
export interface CreateCategoryInputDto {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Output DTO for category operations
 */
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string; // ISO date string
}

/**
 * Zod schema for validating category creation input
 */
export const createCategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  slug: z.string()
    .min(1, 'Category slug is required')
    .max(100, 'Category slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});
