import { UpdateSubscriptionPlanInputDTO, SubscriptionPlanDTO } from '@/src/application/dtos/subscription/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/subscription/backend/subscription-mapper';
import { UpdateSubscriptionPlanEntity } from '@/src/domain/entities/subscription/backend/backend-subscription.entity';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for updating subscription plan
 * Following SOLID principles and Clean Architecture
 */
export class UpdateSubscriptionPlanUseCase implements IUseCase<UpdateSubscriptionPlanInputDTO, SubscriptionPlanDTO> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to update subscription plan
   * @param params Subscription plan update parameters
   * @returns Updated subscription plan data
   */
  async execute(params: UpdateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO> {
    try {
      // Validate required fields
      if (!params.id?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan ID is required',
          'UpdateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      // Check if subscription plan exists
      const existingSubscriptionPlan = await this.subscriptionPlanRepository.getPlanById(params.id);
      if (!existingSubscriptionPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'UpdateSubscriptionPlanUseCase.execute',
          { params }
        );
      }

      // Note: Tier updates are not supported through this DTO

      // Create update entity with only provided fields
      const updateSubscriptionPlanEntity: Partial<Omit<UpdateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'>> = {};

      // Only include fields that are provided in the update
      if (params.name !== undefined) {
        if (!params.name.trim()) {
          throw new BackendSubscriptionError(
            BackendSubscriptionErrorType.VALIDATION_ERROR,
            'Subscription plan name cannot be empty',
            'UpdateSubscriptionPlanUseCase.execute',
            { params }
          );
        }
        updateSubscriptionPlanEntity.name = params.name.trim();
      }

      if (params.nameEn !== undefined) {
        if (!params.nameEn.trim()) {
          throw new BackendSubscriptionError(
            BackendSubscriptionErrorType.VALIDATION_ERROR,
            'Subscription plan English name cannot be empty',
            'UpdateSubscriptionPlanUseCase.execute',
            { params }
          );
        }
        updateSubscriptionPlanEntity.nameEn = params.nameEn.trim();
      }

      if (params.description !== undefined) {
        updateSubscriptionPlanEntity.description = params.description?.trim() || undefined;
      }

      if (params.descriptionEn !== undefined) {
        updateSubscriptionPlanEntity.descriptionEn = params.descriptionEn?.trim() || undefined;
      }

      // Pricing updates
      if (params.monthlyPrice !== undefined) {
        updateSubscriptionPlanEntity.monthlyPrice = params.monthlyPrice;
      }

      if (params.yearlyPrice !== undefined) {
        updateSubscriptionPlanEntity.yearlyPrice = params.yearlyPrice;
      }

      if (params.lifetimePrice !== undefined) {
        updateSubscriptionPlanEntity.lifetimePrice = params.lifetimePrice;
      }

      if (params.currency !== undefined) {
        updateSubscriptionPlanEntity.currency = params.currency;
      }

      // Limits updates
      if (params.maxShops !== undefined) {
        updateSubscriptionPlanEntity.maxShops = params.maxShops;
      }

      if (params.maxQueuesPerDay !== undefined) {
        updateSubscriptionPlanEntity.maxQueuesPerDay = params.maxQueuesPerDay;
      }

      if (params.dataRetentionMonths !== undefined) {
        updateSubscriptionPlanEntity.dataRetentionMonths = params.dataRetentionMonths;
      }

      if (params.maxStaff !== undefined) {
        updateSubscriptionPlanEntity.maxStaff = params.maxStaff;
      }

      if (params.maxSmsPerMonth !== undefined) {
        updateSubscriptionPlanEntity.maxSmsPerMonth = params.maxSmsPerMonth;
      }

      if (params.maxPromotions !== undefined) {
        updateSubscriptionPlanEntity.maxPromotions = params.maxPromotions;
      }

      if (params.maxFreePosterDesigns !== undefined) {
        updateSubscriptionPlanEntity.maxFreePosterDesigns = params.maxFreePosterDesigns;
      }

      // Features updates
      if (params.hasAdvancedReports !== undefined) {
        updateSubscriptionPlanEntity.hasAdvancedReports = params.hasAdvancedReports;
      }

      if (params.hasCustomQrCode !== undefined) {
        updateSubscriptionPlanEntity.hasCustomQrCode = params.hasCustomQrCode;
      }

      if (params.hasApiAccess !== undefined) {
        updateSubscriptionPlanEntity.hasApiAccess = params.hasApiAccess;
      }

      if (params.hasPrioritySupport !== undefined) {
        updateSubscriptionPlanEntity.hasPrioritySupport = params.hasPrioritySupport;
      }

      if (params.hasCustomBranding !== undefined) {
        updateSubscriptionPlanEntity.hasCustomBranding = params.hasCustomBranding;
      }

      if (params.hasAnalytics !== undefined) {
        updateSubscriptionPlanEntity.hasAnalytics = params.hasAnalytics;
      }

      if (params.hasPromotionFeatures !== undefined) {
        updateSubscriptionPlanEntity.hasPromotionFeatures = params.hasPromotionFeatures;
      }

      // Metadata updates
      if (params.features !== undefined) {
        updateSubscriptionPlanEntity.features = params.features;
      }

      if (params.featuresEn !== undefined) {
        updateSubscriptionPlanEntity.featuresEn = params.featuresEn;
      }

      if (params.isActive !== undefined) {
        updateSubscriptionPlanEntity.isActive = params.isActive;
      }

      if (params.sortOrder !== undefined) {
        updateSubscriptionPlanEntity.sortOrder = params.sortOrder;
      }

      const updatedSubscriptionPlan = await this.subscriptionPlanRepository.updatePlan(params.id, updateSubscriptionPlanEntity);
      return SubscriptionMapper.subscriptionPlanToDTO(updatedSubscriptionPlan);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to update subscription plan',
        'UpdateSubscriptionPlanUseCase.execute',
        { params },
        error
      );
    }
  }
}
