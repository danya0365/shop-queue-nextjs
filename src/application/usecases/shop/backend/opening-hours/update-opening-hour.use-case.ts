import {
  OpeningHourDTO,
  UpdateOpeningHourInputDTO,
  UpdateOpeningHourOutput,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class UpdateOpeningHourUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    input: UpdateOpeningHourInputDTO
  ): Promise<UpdateOpeningHourOutput> {
    try {
      this.logger.info("UpdateOpeningHourUseCase: Updating opening hour", {
        id: input.id,
      });

      // Validate input
      if (!input.id) {
        throw OpeningHourError.validationError("Opening hour ID is required");
      }

      // Get existing opening hour
      const existingOpeningHour = await this.repository.getOpeningHourById(
        input.id
      );
      if (!existingOpeningHour) {
        throw OpeningHourError.notFound(input.id);
      }

      // Validate time range if opening
      if (input.isOpen !== false && input.openTime && input.closeTime) {
        this.validateTimeRange(input.openTime, input.closeTime);

        // Validate break time if provided
        if (input.breakStart && input.breakEnd) {
          this.validateBreakTime(
            input.breakStart,
            input.breakEnd,
            input.openTime,
            input.closeTime
          );
        }
      }

      // Update entity
      const updatedOpeningHour = existingOpeningHour.update(
        input.isOpen,
        input.openTime,
        input.closeTime,
        input.breakStart,
        input.breakEnd
      );

      // Save to repository
      const savedOpeningHour = await this.repository.updateOpeningHour(
        input.id,
        updatedOpeningHour
      );

      // Convert entity to DTO
      const openingHourDTO = this.entityToDTO(savedOpeningHour);

      this.logger.info(
        "UpdateOpeningHourUseCase: Successfully updated opening hour",
        {
          id: input.id,
          shopId: openingHourDTO.shopId,
          dayOfWeek: openingHourDTO.dayOfWeek,
        }
      );

      return {
        openingHour: openingHourDTO,
      };
    } catch (error) {
      this.logger.error(
        "UpdateOpeningHourUseCase: Error updating opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to update opening hour", {
        id: input.id,
        originalError: error,
      });
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
