import type { OpeningHour, OpeningHoursBackendService } from '@/src/application/services/shop/backend/opening-hours-backend-service';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { Metadata } from 'next';
import { BaseShopPresenter } from '../BaseShopPresenter';

// Define ViewModel interface
export interface OpeningHoursViewModel {
  openingHours: OpeningHour[];
  weeklySchedule: Record<string, OpeningHour>;
  totalOpenDays: number;
  totalClosedDays: number;
  averageOpenHours: number;
  hasBreakTime: number;
  dayLabels: Record<string, string>;
}

// Main Presenter class
export class OpeningHoursPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly openingHoursBackendService: OpeningHoursBackendService,
  ) {
    super(logger);
  }

  async getViewModel(shopId: string): Promise<OpeningHoursViewModel> {
    try {
      this.logger.info('OpeningHoursPresenter: Getting view model', { shopId });

      // Get opening hours data
      const openingHours = await this.openingHoursBackendService.getOpeningHours(shopId);
      const weeklySchedule = await this.openingHoursBackendService.getWeeklySchedule(shopId);

      // Calculate statistics
      const totalOpenDays = openingHours.filter(hour => hour.isOpen).length;
      const totalClosedDays = openingHours.length - totalOpenDays;

      // Calculate average open hours per day
      const openDays = openingHours.filter(hour => hour.isOpen && hour.openTime && hour.closeTime);
      const totalHours = openDays.reduce((sum, hour) => {
        if (hour.openTime && hour.closeTime) {
          const openMinutes = this.timeToMinutes(hour.openTime);
          const closeMinutes = this.timeToMinutes(hour.closeTime);
          let dayMinutes = closeMinutes - openMinutes;

          // Subtract break time if exists
          if (hour.breakStart && hour.breakEnd) {
            const breakStartMinutes = this.timeToMinutes(hour.breakStart);
            const breakEndMinutes = this.timeToMinutes(hour.breakEnd);
            dayMinutes -= (breakEndMinutes - breakStartMinutes);
          }

          return sum + (dayMinutes / 60); // Convert to hours
        }
        return sum;
      }, 0);

      const averageOpenHours = openDays.length > 0 ? totalHours / openDays.length : 0;
      const hasBreakTime = openingHours.filter(hour => hour.breakStart && hour.breakEnd).length;

      // Thai day labels
      const dayLabels = {
        monday: 'จันทร์',
        tuesday: 'อังคาร',
        wednesday: 'พุธ',
        thursday: 'พฤหัสบดี',
        friday: 'ศุกร์',
        saturday: 'เสาร์',
        sunday: 'อาทิตย์',
      };

      return {
        openingHours,
        weeklySchedule,
        totalOpenDays,
        totalClosedDays,
        averageOpenHours,
        hasBreakTime,
        dayLabels,
      };
    } catch (error) {
      this.logger.error('OpeningHoursPresenter: Error getting view model', error);
      throw error;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(shopId, 'จัดการเวลาเปิด-ปิด', 'จัดการเวลาทำการของร้าน กำหนดวันเวลาเปิด-ปิด และเวลาพักเบรก');
  }
}

// Factory class
export class OpeningHoursPresenterFactory {
  static async create(): Promise<OpeningHoursPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const openingHoursBackendService = serverContainer.resolve<OpeningHoursBackendService>('OpeningHoursBackendService');
    return new OpeningHoursPresenter(logger, openingHoursBackendService);
  }
}
