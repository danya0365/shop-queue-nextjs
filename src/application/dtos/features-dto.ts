/**
 * Feature category types
 */
export type FeatureCategory = 'queue_management' | 'analytics' | 'communication' | 'business' | 'technical';

/**
 * Feature benefit interface
 */
export interface FeatureBenefit {
  title: string;
  description: string;
  icon: string;
}

/**
 * Individual feature DTO
 */
export interface FeatureDto {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category: FeatureCategory;
  benefits: FeatureBenefit[];
  isPopular: boolean;
  isPremium: boolean;
  imageUrl?: string;
  demoUrl?: string;
}

/**
 * Feature section DTO
 */
export interface FeatureSectionDto {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  features: FeatureDto[];
}

/**
 * Testimonial DTO
 */
export interface TestimonialDto {
  id: string;
  name: string;
  business: string;
  avatar: string;
  rating: number;
  comment: string;
  feature: string;
}