import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import { DatabaseDataSource, FilterOperator, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";
import { SupabaseBackendOpeningHourMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-opening-hour.mapper";
import { StandardRepository } from "../../base/standard-repository";
import { OpeningHourSchema } from "@/src/infrastructure/schemas/shop/backend/opening-hour.schema";

type OpeningHourSchemaRecord = Record<string, unknown> & OpeningHourSchema;

/**
 * Supabase implementation of the opening hours repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendOpeningHoursRepository
  extends StandardRepository
  implements ShopBackendOpeningHoursRepository
{
  private readonly tableName = "shop_opening_hours";

  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendOpeningHours");
  }

  async getOpeningHours(shopId: string): Promise<OpeningHourEntity[]> {
    try {
      const data = await this.dataSource.getAdvanced<OpeningHourSchemaRecord>(this.tableName, {
        filters: [{ field: "shop_id", operator: FilterOperator.EQ, value: shopId }],
        sort: [{ field: "day_of_week", direction: SortDirection.ASC }],
      });

      return data.map((item) =>
        SupabaseBackendOpeningHourMapper.toEntity(item)
      );
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error getting opening hours",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to get opening hours", {
        shopId,
        originalError: error,
      });
    }
  }

  async getOpeningHourById(id: string): Promise<OpeningHourEntity | null> {
    try {
      const data = await this.dataSource.getById<OpeningHourSchemaRecord>(this.tableName, id);

      return data ? SupabaseBackendOpeningHourMapper.toEntity(data) : null;
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error getting opening hour by ID",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to get opening hour by ID", {
        id,
        originalError: error,
      });
    }
  }

  async getOpeningHourByDay(
    shopId: string,
    dayOfWeek: string
  ): Promise<OpeningHourEntity | null> {
    try {
      const data = await this.dataSource.getAdvanced<OpeningHourSchemaRecord>(this.tableName, {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "day_of_week", operator: FilterOperator.EQ, value: dayOfWeek },
        ],
      });

      return data.length > 0 ? SupabaseBackendOpeningHourMapper.toEntity(data[0]) : null;
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error getting opening hour by day",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError(
        "Failed to get opening hour by day",
        {
          shopId,
          dayOfWeek,
          originalError: error,
        }
      );
    }
  }

  async createOpeningHour(
    openingHour: OpeningHourEntity
  ): Promise<OpeningHourEntity> {
    try {
      const createData =
        SupabaseBackendOpeningHourMapper.toCreateSchema(openingHour);

      const data = await this.dataSource.insert<OpeningHourSchemaRecord>(this.tableName, createData);

      return SupabaseBackendOpeningHourMapper.toEntity(data);
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error creating opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to create opening hour", {
        shopId: openingHour.shopId,
        dayOfWeek: openingHour.dayOfWeek,
        originalError: error,
      });
    }
  }

  async updateOpeningHour(
    id: string,
    openingHour: OpeningHourEntity
  ): Promise<OpeningHourEntity> {
    try {
      const updateData =
        SupabaseBackendOpeningHourMapper.toUpdateSchema(openingHour);

      const data = await this.dataSource.update<OpeningHourSchemaRecord>(this.tableName, id, updateData);

      return SupabaseBackendOpeningHourMapper.toEntity(data);
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error updating opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to update opening hour", {
        id,
        originalError: error,
      });
    }
  }

  async deleteOpeningHour(id: string): Promise<boolean> {
    try {
      await this.dataSource.delete(this.tableName, id);
      return true;
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error deleting opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to delete opening hour", {
        id,
        originalError: error,
      });
    }
  }

  async bulkUpdateOpeningHours(
    shopId: string,
    openingHours: OpeningHourEntity[]
  ): Promise<OpeningHourEntity[]> {
    try {
      // Since DatabaseDataSource doesn't have bulkUpdate, we'll update each record individually
      const results: OpeningHourEntity[] = [];
      
      for (const hour of openingHours) {
        const updateData = SupabaseBackendOpeningHourMapper.toUpdateSchema(hour);
        const data = await this.dataSource.update<OpeningHourSchemaRecord>(this.tableName, hour.id, updateData);
        results.push(SupabaseBackendOpeningHourMapper.toEntity(data));
      }

      return results;
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error bulk updating opening hours",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError(
        "Failed to bulk update opening hours",
        {
          shopId,
          count: openingHours.length,
          originalError: error,
        }
      );
    }
  }

  async getWeeklySchedule(
    shopId: string
  ): Promise<Record<string, OpeningHourEntity>> {
    try {
      const openingHours = await this.getOpeningHours(shopId);
      const weeklySchedule: Record<string, OpeningHourEntity> = {};

      openingHours.forEach((hour) => {
        weeklySchedule[hour.dayOfWeek] = hour;
      });

      return weeklySchedule;
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error getting weekly schedule",
        error
      );
      throw error;
    }
  }

  async getOpeningHoursStats(shopId: string): Promise<{
    totalOpenDays: number;
    totalClosedDays: number;
    averageOpenHours: number;
    hasBreakTime: number;
  }> {
    try {
      const openingHours = await this.getOpeningHours(shopId);

      const totalOpenDays = openingHours.filter((hour) => hour.isOpen).length;
      const totalClosedDays = openingHours.filter(
        (hour) => !hour.isOpen
      ).length;

      const openHours = openingHours
        .filter((hour) => hour.isOpen)
        .map((hour) => hour.totalWorkingHours);

      const averageOpenHours =
        openHours.length > 0
          ? openHours.reduce((sum, hours) => sum + hours, 0) / openHours.length
          : 0;

      const hasBreakTime = openingHours.filter(
        (hour) => hour.hasBreakTime
      ).length;

      return {
        totalOpenDays,
        totalClosedDays,
        averageOpenHours: Math.round(averageOpenHours * 100) / 100, // Round to 2 decimal places
        hasBreakTime,
      };
    } catch (error) {
      this.logger.error(
        "SupabaseBackendOpeningHoursRepository: Error getting opening hours stats",
        error
      );
      throw error;
    }
  }
}
