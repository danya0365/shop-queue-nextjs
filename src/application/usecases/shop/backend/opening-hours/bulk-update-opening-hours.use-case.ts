import {
  BulkUpdateOpeningHoursInput,
  BulkUpdateOpeningHoursOutput,
  OpeningHourDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class BulkUpdateOpeningHoursUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    input: BulkUpdateOpeningHoursInput
  ): Promise<BulkUpdateOpeningHoursOutput> {
    try {
      this.logger.info(
        "BulkUpdateOpeningHoursUseCase: Bulk updating opening hours",
        {
          shopId: input.shopId,
          count: input.openingHours.length,
        }
      );

      // Validate input
      if (!input.shopId) {
        throw OpeningHourError.validationError("Shop ID is required");
      }

      if (!input.openingHours || input.openingHours.length === 0) {
        throw OpeningHourError.validationError(
          "Opening hours data is required"
        );
      }

      // Get existing opening hours for the shop
      const existingOpeningHours = await this.repository.getOpeningHours(
        input.shopId
      );
      const existingHoursMap = new Map(
        existingOpeningHours.map((hour) => [hour.dayOfWeek, hour])
      );

      // Validate and prepare updates
      const updatedEntities: OpeningHourEntity[] = [];
      const validationErrors: string[] = [];

      for (const hourData of input.openingHours) {
        try {
          // Find existing opening hour by day of week
          const existingHour = existingHoursMap.get(hourData.dayOfWeek);

          if (!existingHour) {
            validationErrors.push(
              `Opening hour for ${hourData.dayOfWeek} not found`
            );
            continue;
          }

          // Validate time range if opening
          if (
            hourData.isOpen !== false &&
            hourData.openTime &&
            hourData.closeTime
          ) {
            this.validateTimeRange(hourData.openTime, hourData.closeTime);

            // Validate break time if provided
            if (hourData.breakStart && hourData.breakEnd) {
              this.validateBreakTime(
                hourData.breakStart,
                hourData.breakEnd,
                hourData.openTime,
                hourData.closeTime
              );
            }
          }

          // Update entity
          const updatedHour = existingHour.update(
            hourData.isOpen,
            hourData.openTime,
            hourData.closeTime,
            hourData.breakStart,
            hourData.breakEnd
          );

          updatedEntities.push(updatedHour);
        } catch (error) {
          if (error instanceof OpeningHourError) {
            validationErrors.push(`${hourData.dayOfWeek}: ${error.message}`);
          } else {
            validationErrors.push(`${hourData.dayOfWeek}: Unknown error`);
          }
        }
      }

      if (validationErrors.length > 0) {
        throw OpeningHourError.validationError(
          "Validation errors occurred during bulk update",
          { errors: validationErrors }
        );
      }

      if (updatedEntities.length === 0) {
        throw OpeningHourError.validationError(
          "No valid opening hours to update"
        );
      }

      // Perform bulk update
      const savedOpeningHours = await this.repository.bulkUpdateOpeningHours(
        input.shopId,
        updatedEntities
      );

      // Convert entities to DTOs
      const openingHourDTOs: OpeningHourDTO[] = savedOpeningHours.map(
        this.entityToDTO
      );

      this.logger.info(
        "BulkUpdateOpeningHoursUseCase: Successfully bulk updated opening hours",
        {
          shopId: input.shopId,
          count: openingHourDTOs.length,
        }
      );

      return {
        openingHours: openingHourDTOs,
      };
    } catch (error) {
      this.logger.error(
        "BulkUpdateOpeningHoursUseCase: Error bulk updating opening hours",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError(
        "Failed to bulk update opening hours",
        { shopId: input.shopId, originalError: error }
      );
    }
  }

  private validateTimeRange(openTime: string, closeTime: string): void {
    const openMinutes = this.timeToMinutes(openTime);
    const closeMinutes = this.timeToMinutes(closeTime);

    if (closeMinutes <= openMinutes) {
      throw OpeningHourError.invalidTimeRange(openTime, closeTime);
    }
  }

  private validateBreakTime(
    breakStart: string,
    breakEnd: string,
    openTime: string,
    closeTime: string
  ): void {
    const breakStartMinutes = this.timeToMinutes(breakStart);
    const breakEndMinutes = this.timeToMinutes(breakEnd);
    const openMinutes = this.timeToMinutes(openTime);
    const closeMinutes = this.timeToMinutes(closeTime);

    if (breakEndMinutes <= breakStartMinutes) {
      throw OpeningHourError.invalidBreakTime(
        breakStart,
        breakEnd,
        openTime,
        closeTime
      );
    }

    if (breakStartMinutes < openMinutes || breakEndMinutes > closeMinutes) {
      throw OpeningHourError.invalidBreakTime(
        breakStart,
        breakEnd,
        openTime,
        closeTime
      );
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private entityToDTO(entity: OpeningHourEntity): OpeningHourDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      dayOfWeek: entity.dayOfWeek,
      isOpen: entity.isOpen,
      openTime: entity.openTime,
      closeTime: entity.closeTime,
      breakStart: entity.breakStart,
      breakEnd: entity.breakEnd,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
