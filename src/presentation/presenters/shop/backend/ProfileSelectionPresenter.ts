import type {
  CreateProfileDto,
  ProfileDto,
} from "@/src/application/dtos/profile-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface for profile selection
export interface ProfileSelectionViewModel {
  profiles: ProfileDto[];
  totalCount: number;
}

// Main Presenter class for profile selection
export class ProfileSelectionPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    protected readonly profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(searchQuery?: string): Promise<ProfileSelectionViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get profiles data
      const profiles = await this.profileService.getProfilesByAuthId(
        profile.authId
      );

      // Filter profiles if search query is provided
      const filteredProfiles = searchQuery
        ? profiles.filter(
            (profile) =>
              profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              profile.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : profiles;

      return {
        profiles: filteredProfiles,
        totalCount: filteredProfiles.length,
      };
    } catch (error) {
      this.logger.error(
        "ProfileSelectionPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  async createProfile(profileData: CreateProfileDto): Promise<ProfileDto> {
    try {
      this.logger.info("ProfileSelectionPresenter: Creating profile", {
        name: profileData.name,
      });

      const profile = await this.profileService.createProfile(profileData);

      return profile;
    } catch (error) {
      this.logger.error(
        "ProfileSelectionPresenter: Error creating profile",
        error
      );
      throw error;
    }
  }
}

// Factory class
export class ProfileSelectionPresenterFactory {
  static async create(): Promise<ProfileSelectionPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new ProfileSelectionPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}

// Client-side Factory class
export class ClientProfileSelectionPresenterFactory {
  static async create(): Promise<ProfileSelectionPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new ProfileSelectionPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}
