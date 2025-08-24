import { z } from 'zod';

/**
 * DTO for creating a category
 * Following SOLID principles by separating input data from domain entities
 */
export interface CreateCategoryInputDto {
  /**
   * Name of the category
   */
  name: string;
  
  /**
   * URL-friendly slug for the category
   */
  slug: string;
  
  /**
   * Optional description of the category
   */
  description?: string;
}

/**
 * Zod schema for validating CreateCategoryInputDto
 */
export const createCategoryInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

/**
 * Type for validated CreateCategoryInputDto
 */
export type ValidatedCreateCategoryInput = z.infer<typeof createCategoryInputSchema>;
