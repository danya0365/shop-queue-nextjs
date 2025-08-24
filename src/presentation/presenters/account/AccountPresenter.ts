import { AuthUserDto } from '@/src/application/dtos/auth-dto';
import { ProfileDto } from '@/src/application/dtos/profile-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

/**
 * ViewModel for Account page
 */
export interface AccountViewModel {
  user: AuthUserDto | null;
  activeProfile: ProfileDto | null;
}

/**
 * AccountPresenter handles business logic for the account page
 * Following SOLID principles and Clean Architecture
 */
export class AccountPresenter {
  constructor(private readonly logger: Logger,
    private readonly authService: IAuthService,
    private readonly profileService: IProfileService
  ) { }

  /**
   * Get view model for account page
   */
  async getViewModel(): Promise<AccountViewModel> {
    try {
      const user = await this.getUser();
      const authId = user?.id;
      if (!authId) {
        throw new Error('User not found');
      }
      const activeProfile = await this.profileService.getActiveProfileByAuthId(authId);
      return {
        user: user,
        activeProfile: activeProfile
      };
    } catch (error) {
      this.logger.error('AccountPresenter: Error getting view model', error);
      throw error;
    }
  }

  /**
   * Generate metadata for the account page
   */
  generateMetadata() {
    return {
      title: 'จัดการบัญชี | Shop Queue',
      description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ'
    };
  }

  /**
 * Get the current authenticated user
 * @returns The authenticated user or null if not authenticated
 */
  private async getUser(): Promise<AuthUserDto | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (err) {
      if (this.logger) {
        this.logger.error('Error accessing authentication:', err as Error);
      }
      return null;
    }
  }
}

export class AccountPresenterFactory {
  static async create(): Promise<AccountPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService = serverContainer.resolve<IProfileService>("ProfileService");
    return new AccountPresenter(logger, authService, profileService);
  }
}