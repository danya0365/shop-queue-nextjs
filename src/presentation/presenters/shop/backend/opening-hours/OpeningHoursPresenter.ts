import {
  BulkUpdateOpeningHourInputDTO,
  CreateOpeningHourInputDTO,
  OpeningHourDTO,
  UpdateOpeningHourInputDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { IShopBackendOpeningHoursService } from "@/src/application/services/shop/backend/BackendOpeningHoursService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { Container } from "@/src/di/container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { Metadata } from "next";
import { BaseShopBackendPresenter } from "../BaseShopBackendPresenter";

// Define ViewModel interface
export interface OpeningHoursViewModel {
  openingHours: OpeningHourDTO[];
  weeklySchedule: Record<string, OpeningHourDTO>;
  totalOpenDays: number;
  totalClosedDays: number;
  averageOpenHours: number;
  hasBreakTime: number;
  dayLabels: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

// Main Presenter class
export class OpeningHoursPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly openingHoursBackendService: IShopBackendOpeningHoursService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<OpeningHoursViewModel> {
    try {
      this.logger.info("OpeningHoursPresenter: Getting view model", { shopId });

      // Get opening hours data
      const openingHours =
        await this.openingHoursBackendService.getOpeningHours(shopId);
      const weeklySchedule =
        await this.openingHoursBackendService.getWeeklySchedule(shopId);

      // Calculate statistics
      const totalOpenDays = openingHours.filter((hour) => hour.isOpen).length;
      const totalClosedDays = openingHours.length - totalOpenDays;

      // Calculate average open hours per day
      const openDays = openingHours.filter(
        (hour) => hour.isOpen && hour.openTime && hour.closeTime
      );
      const totalHours = openDays.reduce((sum, hour) => {
        if (hour.openTime && hour.closeTime) {
          const openMinutes = this.timeToMinutes(hour.openTime);
          const closeMinutes = this.timeToMinutes(hour.closeTime);
          let dayMinutes = closeMinutes - openMinutes;

          // Subtract break time if exists
          if (hour.breakStart && hour.breakEnd) {
            const breakStartMinutes = this.timeToMinutes(hour.breakStart);
            const breakEndMinutes = this.timeToMinutes(hour.breakEnd);
            dayMinutes -= breakEndMinutes - breakStartMinutes;
          }

          return sum + dayMinutes / 60; // Convert to hours
        }
        return sum;
      }, 0);

      const averageOpenHours =
        openDays.length > 0 ? totalHours / openDays.length : 0;
      const hasBreakTime = openingHours.filter(
        (hour) => hour.breakStart && hour.breakEnd
      ).length;

      // Thai day labels
      const dayLabels = {
        monday: "จันทร์",
        tuesday: "อังคาร",
        wednesday: "พุธ",
        thursday: "พฤหัสบดี",
        friday: "ศุกร์",
        saturday: "เสาร์",
        sunday: "อาทิตย์",
      };

      return {
        openingHours,
        weeklySchedule,
        totalOpenDays,
        totalClosedDays,
        averageOpenHours,
        hasBreakTime,
        dayLabels,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      this.logger.error(
        "OpeningHoursPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  async createOpeningHour(
    shopId: string,
    data: CreateOpeningHourInputDTO
  ): Promise<OpeningHourDTO> {
    try {
      const service = this.openingHoursBackendService;

      this.logger.info("OpeningHoursPresenter: Creating opening hour", {
        shopId,
        data,
      });

      const openingHour = await service.createOpeningHour(shopId, data);
      return openingHour;
    } catch (error) {
      this.logger.error("OpeningHoursPresenter: Error creating opening hour", {
        shopId,
        data,
        error,
      });
      throw error;
    }
  }

  async updateOpeningHour(
    shopId: string,
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ): Promise<OpeningHourDTO> {
    try {
      this.logger.info("OpeningHoursPresenter: Updating opening hour", {
        shopId,
        hourId,
        data,
      });

      const openingHour =
        await this.openingHoursBackendService.updateOpeningHour(
          shopId,
          hourId,
          data
        );
      return openingHour;
    } catch (error) {
      this.logger.error("OpeningHoursPresenter: Error updating opening hour", {
        shopId,
        hourId,
        data,
        error,
      });
      throw error;
    }
  }

  async deleteOpeningHour(shopId: string, hourId: string): Promise<boolean> {
    try {
      this.logger.info("OpeningHoursPresenter: Deleting opening hour", {
        shopId,
        hourId,
      });

      const success = await this.openingHoursBackendService.deleteOpeningHour(
        shopId,
        hourId
      );
      return success;
    } catch (error) {
      this.logger.error("OpeningHoursPresenter: Error deleting opening hour", {
        shopId,
        hourId,
        error,
      });
      throw error;
    }
  }

  async bulkUpdateOpeningHours(
    shopId: string,
    hours: BulkUpdateOpeningHourInputDTO[]
  ): Promise<OpeningHourDTO[]> {
    try {
      this.logger.info("OpeningHoursPresenter: Bulk updating opening hours", {
        shopId,
        count: hours.length,
      });

      const openingHours =
        await this.openingHoursBackendService.bulkUpdateOpeningHours(
          shopId,
          hours
        );
      return openingHours;
    } catch (error) {
      this.logger.error(
        "OpeningHoursPresenter: Error bulk updating opening hours",
        {
          shopId,
          error,
        }
      );
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      "จัดการเวลาเปิด-ปิด",
      "จัดการเวลาทำการของร้าน กำหนดวันเวลาเปิด-ปิด และเวลาพักเบรก"
    );
  }
}

// Base Factory class for reducing code duplication
abstract class BaseOpeningHoursPresenterFactory {
  protected static async createPresenter(
    getContainer: () => Promise<Container> | Container
  ): Promise<OpeningHoursPresenter> {
    try {
      const container = await getContainer();
      const logger = container.resolve<Logger>("Logger");
      const shopService = container.resolve<IShopService>("ShopService");
      const authService = container.resolve<IAuthService>("AuthService");
      const profileService =
        container.resolve<IProfileService>("ProfileService");
      const subscriptionService = container.resolve<ISubscriptionService>(
        "SubscriptionService"
      );
      const openingHoursBackendService =
        container.resolve<IShopBackendOpeningHoursService>(
          "ShopBackendOpeningHoursService"
        );

      return new OpeningHoursPresenter(
        logger,
        shopService,
        authService,
        profileService,
        subscriptionService,
        openingHoursBackendService
      );
    } catch (error) {
      throw new Error(
        `Failed to create OpeningHoursPresenter: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory class for server-side
export class OpeningHoursPresenterFactory extends BaseOpeningHoursPresenterFactory {
  static async create(): Promise<OpeningHoursPresenter> {
    return this.createPresenter(() => getServerContainer());
  }
}

// Factory class for client-side
export class ClientOpeningHoursPresenterFactory extends BaseOpeningHoursPresenterFactory {
  static async create(): Promise<OpeningHoursPresenter> {
    return this.createPresenter(() => getClientContainer());
  }
}
