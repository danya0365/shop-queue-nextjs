import {
  DatabaseDataSource,
  FilterOperator,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";

export interface ShopSetupProgress {
  hasBasicInfo: boolean;
  hasSettings: boolean;
  hasOpeningHours: boolean;
  hasServices: boolean;
  hasEmployees: boolean;
  hasDepartments: boolean;
  servicesCount: number;
  employeesCount: number;
  departmentsCount: number;
}

export interface IShopSetupProgressService {
  getShopSetupProgress(shopId: string): Promise<ShopSetupProgress>;
  isShopQueueReady(shopId: string): Promise<boolean>;
}

export class ShopSetupProgressService implements IShopSetupProgressService {
  constructor(
    private readonly databaseDataSource: DatabaseDataSource,
    private readonly logger: Logger
  ) {}

  async getShopSetupProgress(shopId: string): Promise<ShopSetupProgress> {
    try {
      const [
        shopResult,
        settingsResult,
        openingHoursResult,
        servicesResult,
        employeesResult,
        departmentsResult,
      ] = await Promise.all([
        this.databaseDataSource.getById("shops", shopId),
        this.databaseDataSource.getAdvanced("shop_settings", {
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
        }),
        this.databaseDataSource.getAdvanced("shop_opening_hours", {
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
        }),
        this.databaseDataSource.getAdvanced("services", {
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
        }),
        this.databaseDataSource.getAdvanced("employees", {
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
        }),
        this.databaseDataSource.getAdvanced("departments", {
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
        }),
      ]);

      const hasBasicInfo = !!(
        shopResult?.name && shopResult?.status === "active"
      );
      const hasSettings = settingsResult.length > 0;
      const hasOpeningHours = openingHoursResult.length > 0;
      const servicesCount = servicesResult.length;
      const employeesCount = employeesResult.length;
      const departmentsCount = departmentsResult.length;

      const hasServices = servicesCount > 0;
      const hasEmployees = employeesCount > 0;
      const hasDepartments = departmentsCount > 0;

      const progress: ShopSetupProgress = {
        hasBasicInfo,
        hasSettings,
        hasOpeningHours,
        hasServices,
        hasEmployees,
        hasDepartments,
        servicesCount,
        employeesCount,
        departmentsCount,
      };

      this.logger.info("Shop setup progress retrieved", { shopId, progress });
      return progress;
    } catch (error) {
      this.logger.error("Error getting shop setup progress", { shopId, error });
      throw error;
    }
  }

  async isShopQueueReady(shopId: string): Promise<boolean> {
    try {
      const progress = await this.getShopSetupProgress(shopId);

      // Required conditions for queue readiness
      const isReady =
        progress.hasBasicInfo &&
        progress.hasSettings &&
        progress.hasOpeningHours &&
        progress.hasServices &&
        progress.hasEmployees;

      this.logger.info("Shop queue readiness check", {
        shopId,
        isReady,
        progress,
      });
      return isReady;
    } catch (error) {
      this.logger.error("Error checking shop queue readiness", {
        shopId,
        error,
      });
      return false;
    }
  }
}

export class ShopSetupProgressServiceFactory {
  static create(
    databaseDataSource: DatabaseDataSource,
    logger: Logger
  ): ShopSetupProgressService {
    return new ShopSetupProgressService(databaseDataSource, logger);
  }
}
