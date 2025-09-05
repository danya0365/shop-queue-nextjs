import { UpdatePromotionParams, PromotionDTO } from "@/src/application/dtos/backend/promotions-dto";
import { PromotionMapper } from "@/src/application/mappers/backend/promotion-mapper";
import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { UpdatePromotionEntity, PromotionStatus, PromotionType } from "@/src/domain/entities/backend/backend-promotion.entity";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { z } from "zod";

// Input validation schema
const UpdatePromotionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shopId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.nativeEnum(PromotionType).optional(),
  value: z.number().min(0).optional(),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startAt: z.string().min(1).optional(),
  endAt: z.string().min(1).optional(),
  usageLimit: z.number().min(1).optional(),
  status: z.nativeEnum(PromotionStatus).optional(),
  conditions: z.array(z.record(z.string())).optional()
});

/**
 * Use case for updating an existing promotion
 * Following SOLID principles and Clean Architecture
 */
export class UpdatePromotionUseCase implements IUseCase<UpdatePromotionParams, PromotionDTO> {
  constructor(
    private promotionRepository: BackendPromotionRepository
  ) { }

  /**
   * Execute the use case to update an existing promotion
   * @param input Promotion update parameters
   * @returns Updated promotion data
   */
  async execute(input: UpdatePromotionParams): Promise<PromotionDTO> {
    try {
      // Validate input
      const validatedInput = UpdatePromotionSchema.parse(input);

      // Check if promotion exists
      const existingPromotion = await this.promotionRepository.getPromotionById(validatedInput.id);
      if (!existingPromotion) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${validatedInput.id} not found`,
          'UpdatePromotionUseCase.execute',
          { input }
        );
      }

      // Convert DTO to domain entity (only include defined fields)
      const promotionEntity: Partial<Omit<UpdatePromotionEntity, 'id' | 'createdAt' | 'updatedAt'>> = {};
      
      if (validatedInput.shopId !== undefined) promotionEntity.shopId = validatedInput.shopId;
      if (validatedInput.name !== undefined) promotionEntity.name = validatedInput.name;
      if (validatedInput.description !== undefined) promotionEntity.description = validatedInput.description;
      if (validatedInput.type !== undefined) promotionEntity.type = validatedInput.type;
      if (validatedInput.value !== undefined) promotionEntity.value = validatedInput.value;
      if (validatedInput.minPurchaseAmount !== undefined) promotionEntity.minPurchaseAmount = validatedInput.minPurchaseAmount;
      if (validatedInput.maxDiscountAmount !== undefined) promotionEntity.maxDiscountAmount = validatedInput.maxDiscountAmount;
      if (validatedInput.startAt !== undefined) promotionEntity.startAt = validatedInput.startAt;
      if (validatedInput.endAt !== undefined) promotionEntity.endAt = validatedInput.endAt;
      if (validatedInput.usageLimit !== undefined) promotionEntity.usageLimit = validatedInput.usageLimit;
      if (validatedInput.status !== undefined) promotionEntity.status = validatedInput.status;
      if (validatedInput.conditions !== undefined) promotionEntity.conditions = validatedInput.conditions;

      const updatedPromotion = await this.promotionRepository.updatePromotion(validatedInput.id, promotionEntity);
      return PromotionMapper.toDTO(updatedPromotion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.VALIDATION_ERROR,
          `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
          'UpdatePromotionUseCase.execute',
          { input, errors: error.errors }
        );
      }

      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to update promotion',
        'UpdatePromotionUseCase.execute',
        { input },
        error
      );
    }
  }
}
