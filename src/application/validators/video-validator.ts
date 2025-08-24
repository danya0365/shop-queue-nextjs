import { CreateVideoDto, UpdateVideoDto, VideoFilterDto, VideoSearchDto } from '../dtos/video-dto';
import { ValidationResult } from './validation-result';

/**
 * VideoValidator
 * 
 * Responsible for validating video-related DTOs before passing to domain layer
 * Follows Single Responsibility Principle by separating validation logic
 * Uses static methods for validation to avoid unnecessary instantiation
 */
export class VideoValidator {
  /**
   * Validate CreateVideoDto
   * @param dto The CreateVideoDto to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  static validateCreate(dto: CreateVideoDto): ValidationResult {
    const errors: string[] = [];
    
    if (!dto.title || dto.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (dto.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    
    if (!dto.description || dto.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (dto.description.length > 5000) {
      errors.push('Description must be less than 5000 characters');
    }
    
    if (!dto.url || dto.url.trim().length === 0) {
      errors.push('Video URL is required');
    } else if (!this.isValidUrl(dto.url)) {
      errors.push('Invalid video URL format');
    }
    
    if (!dto.thumbnailUrl || dto.thumbnailUrl.trim().length === 0) {
      errors.push('Thumbnail URL is required');
    } else if (!this.isValidUrl(dto.thumbnailUrl)) {
      errors.push('Invalid thumbnail URL format');
    }
    
    if (!dto.categoryId || dto.categoryId.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (!dto.profileId || dto.profileId.trim().length === 0) {
      errors.push('Profile ID is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate UpdateVideoDto
   * @param dto The UpdateVideoDto to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  static validateUpdate(dto: UpdateVideoDto): ValidationResult {
    const errors: string[] = [];
    
    // Check if at least one field is provided for update
    if (Object.keys(dto).length === 0) {
      errors.push('At least one field must be provided for update');
      return { isValid: false, errors };
    }
    
    if (dto.title !== undefined) {
      if (dto.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      } else if (dto.title.length > 100) {
        errors.push('Title must be less than 100 characters');
      }
    }
    
    if (dto.description !== undefined && dto.description.length > 5000) {
      errors.push('Description must be less than 5000 characters');
    }
    
    if (dto.thumbnailUrl !== undefined) {
      if (dto.thumbnailUrl.trim().length === 0) {
        errors.push('Thumbnail URL cannot be empty');
      } else if (!this.isValidUrl(dto.thumbnailUrl)) {
        errors.push('Invalid thumbnail URL format');
      }
    }
    
    if (dto.categoryId !== undefined && dto.categoryId.trim().length === 0) {
      errors.push('Category ID cannot be empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate VideoSearchDto
   * @param dto The VideoSearchDto to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  static validateSearch(dto: VideoSearchDto): ValidationResult {
    const errors: string[] = [];
    
    if (!dto.query || dto.query.trim().length === 0) {
      errors.push('Search query is required');
    }
    
    if (dto.limit !== undefined && (dto.limit < 1 || dto.limit > 100)) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (dto.offset !== undefined && dto.offset < 0) {
      errors.push('Offset cannot be negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate VideoFilterDto
   * @param dto The VideoFilterDto to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  static validateFilter(dto: VideoFilterDto): ValidationResult {
    const errors: string[] = [];
    
    if (dto.limit !== undefined && (dto.limit < 1 || dto.limit > 100)) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (dto.offset !== undefined && dto.offset < 0) {
      errors.push('Offset cannot be negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate if string is a valid URL
   * @param url The URL string to validate
   * @returns boolean indicating if the URL is valid
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Validate video ID format
   * @param id The video ID to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  static validateId(id: string): ValidationResult {
    const errors: string[] = [];
    
    if (!id || id.trim().length === 0) {
      errors.push('Video ID is required');
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      // Validate UUID format if your IDs are UUIDs
      errors.push('Invalid video ID format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
