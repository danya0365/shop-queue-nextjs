import { CreatePromotionParams, PromotionDTO } from "@/src/application/dtos/backend/promotions-dto";
import { PromotionMapper } from "@/src/application/mappers/backend/promotion-mapper";
import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { CreatePromotionEntity, PromotionStatus, PromotionType } from "@/src/domain/entities/backend/backend-promotion.entity";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { z } from "zod";

// Input validation schema
const CreatePromotionSchema = z.object({
  shopId: z.string().min(1, "Shop ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(PromotionType),
  value: z.number().min(0, "Value must be non-negative"),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().min(1, "End date is required"),
  usageLimit: z.number().min(1).optional(),
  status: z.nativeEnum(PromotionStatus).optional(),
  conditions: z.array(z.record(z.string())).optional(),
  createdBy: z.string().min(1, "Created by is required")
});

/**
 * Use case for creating a new promotion
 * Following SOLID principles and Clean Architecture
 */
export class CreatePromotionUseCase implements IUseCase<CreatePromotionParams, PromotionDTO> {
  constructor(
    private promotionRepository: BackendPromotionRepository
  ) { }

  /**
   * Execute the use case to create a new promotion
   * @param input Promotion creation parameters
   * @returns Created promotion data
   */
  async execute(input: CreatePromotionParams): Promise<PromotionDTO> {
    try {
      // Validate input
      const validatedInput = CreatePromotionSchema.parse(input);

      // Convert DTO to domain entity
      const promotionEntity: Omit<CreatePromotionEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        shopId: validatedInput.shopId,
        name: validatedInput.name,
        description: validatedInput.description,
        type: validatedInput.type,
        value: validatedInput.value,
        minPurchaseAmount: validatedInput.minPurchaseAmount,
        maxDiscountAmount: validatedInput.maxDiscountAmount,
        startAt: validatedInput.startAt,
        endAt: validatedInput.endAt,
        usageLimit: validatedInput.usageLimit,
        status: validatedInput.status || PromotionStatus.ACTIVE,
        conditions: validatedInput.conditions,
        createdBy: validatedInput.createdBy
      };

      const createdPromotion = await this.promotionRepository.createPromotion(promotionEntity);
      return PromotionMapper.toDTO(createdPromotion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.VALIDATION_ERROR,
          `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
          'CreatePromotionUseCase.execute',
          { input, errors: error.errors }
        );
      }

      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to create promotion',
        'CreatePromotionUseCase.execute',
        { input },
        error
      );
    }
  }
}
