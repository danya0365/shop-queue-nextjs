import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";

export interface ShopBackendOpeningHoursRepository {
  /**
   * Get all opening hours for a shop
   */
  getOpeningHours(shopId: string): Promise<OpeningHourEntity[]>;

  /**
   * Get opening hour by ID
   */
  getOpeningHourById(id: string): Promise<OpeningHourEntity | null>;

  /**
   * Get opening hour by shop ID and day of week
   */
  getOpeningHourByDay(
    shopId: string,
    dayOfWeek: string
  ): Promise<OpeningHourEntity | null>;

  /**
   * Create a new opening hour
   */
  createOpeningHour(openingHour: OpeningHourEntity): Promise<OpeningHourEntity>;

  /**
   * Update an existing opening hour
   */
  updateOpeningHour(
    id: string,
    openingHour: OpeningHourEntity
  ): Promise<OpeningHourEntity>;

  /**
   * Delete an opening hour
   */
  deleteOpeningHour(id: string): Promise<boolean>;

  /**
   * Bulk update opening hours for a shop
   */
  bulkUpdateOpeningHours(
    shopId: string,
    openingHours: OpeningHourEntity[]
  ): Promise<OpeningHourEntity[]>;

  /**
   * Get weekly schedule as a record
   */
  getWeeklySchedule(shopId: string): Promise<Record<string, OpeningHourEntity>>;

  /**
   * Get opening hours statistics for a shop
   */
  getOpeningHoursStats(shopId: string): Promise<{
    totalOpenDays: number;
    totalClosedDays: number;
    averageOpenHours: number;
    hasBreakTime: number;
  }>;
}
