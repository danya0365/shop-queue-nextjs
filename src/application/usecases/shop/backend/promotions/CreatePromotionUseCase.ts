import { CreatePromotionParams, PromotionDTO } from "@/src/application/dtos/shop/backend/promotions-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/backend/promotion-mapper";
import { CreatePromotionEntity, PromotionStatus, PromotionType } from "@/src/domain/entities/shop/backend/backend-promotion.entity";
import { ShopBackendPromotionError, ShopBackendPromotionErrorType, ShopBackendPromotionRepository } from "@/src/domain/repositories/shop/backend/backend-promotion-repository";
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
    private promotionRepository: ShopBackendPromotionRepository
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
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.VALIDATION_ERROR,
          `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
          'CreatePromotionUseCase.execute',
          { input, errors: error.errors }
        );
      }

      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        'Failed to create promotion',
        'CreatePromotionUseCase.execute',
        { input },
        error
      );
    }
  }
}
