import type { Logger } from '@/src/domain/interfaces/logger';
import type { 
  BackendSubscriptionPlanRepository,
  BackendProfileSubscriptionRepository,
  BackendSubscriptionUsageRepository,
  BackendFeatureAccessRepository
} from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

// Subscription Plan Use Cases
import { CreateSubscriptionPlanUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/CreateSubscriptionPlanUseCase';
import { DeleteSubscriptionPlanUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/DeleteSubscriptionPlanUseCase';
import { GetSubscriptionPlanByIdUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/GetSubscriptionPlanByIdUseCase';
import { GetSubscriptionPlansPaginatedUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/GetSubscriptionPlansPaginatedUseCase';
import { GetSubscriptionStatsUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/GetSubscriptionStatsUseCase';
import { UpdateSubscriptionPlanUseCase } from '@/src/application/usecases/subscription/backend/subscription-plans/UpdateSubscriptionPlanUseCase';

// Profile Subscription Use Cases
import { CreateProfileSubscriptionUseCase } from '@/src/application/usecases/subscription/backend/profile-subscriptions/CreateProfileSubscriptionUseCase';
import { DeleteProfileSubscriptionUseCase } from '@/src/application/usecases/subscription/backend/profile-subscriptions/DeleteProfileSubscriptionUseCase';
import { GetProfileSubscriptionByIdUseCase } from '@/src/application/usecases/subscription/backend/profile-subscriptions/GetProfileSubscriptionByIdUseCase';
import { GetProfileSubscriptionsPaginatedUseCase } from '@/src/application/usecases/subscription/backend/profile-subscriptions/GetProfileSubscriptionsPaginatedUseCase';
import { UpdateProfileSubscriptionUseCase } from '@/src/application/usecases/subscription/backend/profile-subscriptions/UpdateProfileSubscriptionUseCase';

// Subscription Usage Use Cases
import { GetCurrentUsageStatsUseCase } from '@/src/application/usecases/subscription/backend/subscription-usage/GetCurrentUsageStatsUseCase';
import { RecordUsageUseCase } from '@/src/application/usecases/subscription/backend/subscription-usage/RecordUsageUseCase';
import { CanPerformActionUseCase } from '@/src/application/usecases/subscription/backend/subscription-usage/CanPerformActionUseCase';
import { GetSubscriptionUsagePaginatedUseCase } from '@/src/application/usecases/subscription/backend/subscription-usage/GetSubscriptionUsagePaginatedUseCase';

// Feature Access Use Cases
import { GrantFeatureAccessUseCase } from '@/src/application/usecases/subscription/backend/feature-access/GrantFeatureAccessUseCase';
import { HasFeatureAccessUseCase } from '@/src/application/usecases/subscription/backend/feature-access/HasFeatureAccessUseCase';
import { RevokeFeatureAccessUseCase } from '@/src/application/usecases/subscription/backend/feature-access/RevokeFeatureAccessUseCase';
import { GetFeatureAccessPaginatedUseCase } from '@/src/application/usecases/subscription/backend/feature-access/GetFeatureAccessPaginatedUseCase';

import { SubscriptionBackendSubscriptionService } from './BackendSubscriptionService';

/**
 * Factory for creating Backend Subscription Service with all dependencies
 * Following Clean Architecture and SOLID principles
 */
export class SubscriptionBackendSubscriptionServiceFactory {
  /**
   * Create a fully configured Backend Subscription Service
   * @param subscriptionPlanRepository Repository for subscription plans
   * @param profileSubscriptionRepository Repository for profile subscriptions
   * @param subscriptionUsageRepository Repository for subscription usage
   * @param featureAccessRepository Repository for feature access
   * @param logger Logger instance
   * @returns Configured Backend Subscription Service
   */
  static create(
    subscriptionPlanRepository: BackendSubscriptionPlanRepository,
    profileSubscriptionRepository: BackendProfileSubscriptionRepository,
    subscriptionUsageRepository: BackendSubscriptionUsageRepository,
    featureAccessRepository: BackendFeatureAccessRepository,
    logger: Logger
  ): SubscriptionBackendSubscriptionService {
    
    // Create Subscription Plan Use Cases
    const getSubscriptionPlansPaginatedUseCase = new GetSubscriptionPlansPaginatedUseCase(subscriptionPlanRepository);
    const getSubscriptionStatsUseCase = new GetSubscriptionStatsUseCase(subscriptionPlanRepository);
    const getSubscriptionPlanByIdUseCase = new GetSubscriptionPlanByIdUseCase(subscriptionPlanRepository);
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(subscriptionPlanRepository);
    const updateSubscriptionPlanUseCase = new UpdateSubscriptionPlanUseCase(subscriptionPlanRepository);
    const deleteSubscriptionPlanUseCase = new DeleteSubscriptionPlanUseCase(subscriptionPlanRepository);
    
    // Create Profile Subscription Use Cases
    const getProfileSubscriptionsPaginatedUseCase = new GetProfileSubscriptionsPaginatedUseCase(profileSubscriptionRepository);
    const getProfileSubscriptionByIdUseCase = new GetProfileSubscriptionByIdUseCase(profileSubscriptionRepository);
    const createProfileSubscriptionUseCase = new CreateProfileSubscriptionUseCase(profileSubscriptionRepository);
    const updateProfileSubscriptionUseCase = new UpdateProfileSubscriptionUseCase(profileSubscriptionRepository);
    const deleteProfileSubscriptionUseCase = new DeleteProfileSubscriptionUseCase(profileSubscriptionRepository);
    
    // Create Subscription Usage Use Cases
    const getCurrentUsageStatsUseCase = new GetCurrentUsageStatsUseCase(subscriptionUsageRepository);
    const recordUsageUseCase = new RecordUsageUseCase(subscriptionUsageRepository);
    const canPerformActionUseCase = new CanPerformActionUseCase(subscriptionUsageRepository);
    const getSubscriptionUsagePaginatedUseCase = new GetSubscriptionUsagePaginatedUseCase(subscriptionUsageRepository);
    
    // Create Feature Access Use Cases
    const grantFeatureAccessUseCase = new GrantFeatureAccessUseCase(featureAccessRepository);
    const hasFeatureAccessUseCase = new HasFeatureAccessUseCase(featureAccessRepository);
    const revokeFeatureAccessUseCase = new RevokeFeatureAccessUseCase(featureAccessRepository);
    const getFeatureAccessPaginatedUseCase = new GetFeatureAccessPaginatedUseCase(featureAccessRepository);
    
    // Create and return the service with all dependencies
    return new SubscriptionBackendSubscriptionService(
      // Subscription Plan Use Cases
      getSubscriptionPlansPaginatedUseCase,
      getSubscriptionStatsUseCase,
      getSubscriptionPlanByIdUseCase,
      createSubscriptionPlanUseCase,
      updateSubscriptionPlanUseCase,
      deleteSubscriptionPlanUseCase,
      
      // Profile Subscription Use Cases
      getProfileSubscriptionsPaginatedUseCase,
      getProfileSubscriptionByIdUseCase,
      createProfileSubscriptionUseCase,
      updateProfileSubscriptionUseCase,
      deleteProfileSubscriptionUseCase,
      
      // Subscription Usage Use Cases
      getCurrentUsageStatsUseCase,
      recordUsageUseCase,
      canPerformActionUseCase,
      getSubscriptionUsagePaginatedUseCase,
      
      // Feature Access Use Cases
      grantFeatureAccessUseCase,
      hasFeatureAccessUseCase,
      revokeFeatureAccessUseCase,
      getFeatureAccessPaginatedUseCase,
      
      // Logger
      logger
    );
  }
}
