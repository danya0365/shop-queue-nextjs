import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { z } from "zod";

// Input validation schema
const DeletePromotionSchema = z.string().min(1, "Promotion ID is required");

/**
 * Use case for deleting a promotion
 * Following SOLID principles and Clean Architecture
 */
export class DeletePromotionUseCase implements IUseCase<string, boolean> {
  constructor(
    private promotionRepository: BackendPromotionRepository
  ) { }

  /**
   * Execute the use case to delete a promotion
   * @param id Promotion ID
   * @returns Success flag
   */
  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      const validatedId = DeletePromotionSchema.parse(id);

      // Check if promotion exists
      const existingPromotion = await this.promotionRepository.getPromotionById(validatedId);
      if (!existingPromotion) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${validatedId} not found`,
          'DeletePromotionUseCase.execute',
          { id: validatedId }
        );
      }

      const result = await this.promotionRepository.deletePromotion(validatedId);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.VALIDATION_ERROR,
          `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
          'DeletePromotionUseCase.execute',
          { id, errors: error.errors }
        );
      }

      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to delete promotion',
        'DeletePromotionUseCase.execute',
        { id },
        error
      );
    }
  }
}
