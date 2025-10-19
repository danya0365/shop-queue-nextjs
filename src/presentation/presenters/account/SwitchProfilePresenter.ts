import type { Metadata } from "next";

import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import { ProfileDto } from "@/src/application/dtos/profile-dto";
import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import type { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";

export interface SwitchProfileViewModel {
  user: AuthUserDto | null;
  profiles: ProfileDto[];
  activeProfile: ProfileDto | null;
}

export class SwitchProfilePresenter {
  constructor(
    private readonly logger: Logger,
    private readonly authService: IAuthService,
    private readonly profileService: IProfileService
  ) {}

  async getViewModel(): Promise<SwitchProfileViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const [profiles, activeProfile] = await Promise.all([
        this.profileService.getProfilesByAuthId(user.id),
        this.profileService.getActiveProfileByAuthId(user.id),
      ]);

      return {
        user,
        profiles,
        activeProfile,
      };
    } catch (error) {
      this.logger.error("SwitchProfilePresenter: Failed to build view model", error);
      throw error;
    }
  }

  generateMetadata(): Metadata {
    return {
      title: "เปลี่ยนโปรไฟล์การใช้งาน | Shop Queue",
      description: "สลับโปรไฟล์เพื่อใช้งานในบทบาทที่ต้องการได้อย่างรวดเร็ว",
    };
  }

  private async getUser(): Promise<AuthUserDto | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (error) {
      this.logger.error("SwitchProfilePresenter: Failed to get current user", error);
      return null;
    }
  }
}

export class SwitchProfilePresenterFactory {
  static async create(): Promise<SwitchProfilePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService = serverContainer.resolve<IProfileService>("ProfileService");

    return new SwitchProfilePresenter(logger, authService, profileService);
  }
}
