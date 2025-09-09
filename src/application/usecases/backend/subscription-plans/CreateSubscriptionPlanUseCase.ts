import { CreateSubscriptionPlanInputDTO, SubscriptionPlanDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { CreateSubscriptionPlanEntity, SubscriptionTier } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for creating subscription plan
 * Following SOLID principles and Clean Architecture
 */
export class CreateSubscriptionPlanUseCase implements IUseCase<CreateSubscriptionPlanInputDTO, SubscriptionPlanDTO> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to create subscription plan
   * @param params Subscription plan creation parameters
   * @returns Created subscription plan data
   */
  async execute(params: CreateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO> {
    try {
      // Validate required fields
      if (!params.tier) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription tier is required',
          'CreateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      if (!params.name?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan name is required',
          'CreateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      if (!params.nameEn?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan English name is required',
          'CreateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      // Validate tier enum
      if (!Object.values(SubscriptionTier).includes(params.tier as SubscriptionTier)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid subscription tier',
          'CreateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      // Validate pricing (at least one price should be set)
      if (!params.monthlyPrice && !params.yearlyPrice && !params.lifetimePrice) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'At least one pricing option (monthly, yearly, or lifetime) must be set',
          'CreateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      // Create entity
      const createSubscriptionPlanEntity: Omit<CreateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        tier: params.tier as SubscriptionTier,
        name: params.name.trim(),
        nameEn: params.nameEn.trim(),
        description: params.description?.trim() || undefined,
        descriptionEn: params.descriptionEn?.trim() || undefined,

        // Pricing
        monthlyPrice: params.monthlyPrice || undefined,
        yearlyPrice: params.yearlyPrice || undefined,
        lifetimePrice: params.lifetimePrice || undefined,
        currency: params.currency || 'THB',

        // Limits
        maxShops: params.maxShops || undefined,
        maxQueuesPerDay: params.maxQueuesPerDay || undefined,
        dataRetentionMonths: params.dataRetentionMonths || undefined,
        maxStaff: params.maxStaff || undefined,
        maxSmsPerMonth: params.maxSmsPerMonth || undefined,
        maxPromotions: params.maxPromotions || undefined,
        maxFreePosterDesigns: params.maxFreePosterDesigns || 0,

        // Features
        hasAdvancedReports: params.hasAdvancedReports || false,
        hasCustomQrCode: params.hasCustomQrCode || false,
        hasApiAccess: params.hasApiAccess || false,
        hasPrioritySupport: params.hasPrioritySupport || false,
        hasCustomBranding: params.hasCustomBranding || false,
        hasAnalytics: params.hasAnalytics || false,
        hasPromotionFeatures: params.hasPromotionFeatures || false,

        // Metadata
        features: params.features || [],
        featuresEn: params.featuresEn || [],
        isActive: params.isActive !== undefined ? params.isActive : true,
        sortOrder: params.sortOrder || 0
      };

      const createdSubscriptionPlan = await this.subscriptionPlanRepository.createPlan(createSubscriptionPlanEntity);
      return SubscriptionMapper.subscriptionPlanToDTO(createdSubscriptionPlan);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to create subscription plan',
        'CreateSubscriptionPlanUseCase.execute',
        { params },
        error
      );
    }
  }
}
