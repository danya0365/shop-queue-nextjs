import type { Logger } from '@/src/domain/interfaces/logger';

/**
 * ViewModel for Account page
 */
export interface AccountViewModel {
  title: string;
  description: string;
}

/**
 * AccountPresenter handles business logic for the account page
 * Following SOLID principles and Clean Architecture
 */
export class AccountPresenter {
  constructor(private readonly logger: Logger) {}

  /**
   * Get view model for account page
   */
  async getViewModel(): Promise<AccountViewModel> {
    try {
      this.logger.info('AccountPresenter: Getting account view model');

      return {
        title: 'จัดการบัญชีผู้ใช้',
        description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ'
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
}
