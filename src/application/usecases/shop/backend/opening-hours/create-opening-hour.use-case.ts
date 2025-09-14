import {
  CreateOpeningHourInputDTO,
  CreateOpeningHourOutput,
  OpeningHourDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import {
  DayOfWeek,
  OpeningHourEntity,
} from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class CreateOpeningHourUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    input: CreateOpeningHourInputDTO
  ): Promise<CreateOpeningHourOutput> {
    try {
      this.logger.info("CreateOpeningHourUseCase: Creating opening hour", {
        shopId: input.shopId,
        dayOfWeek: input.dayOfWeek,
      });

      // Validate input
      this.validateInput(input);

      // Check if opening hour for this day already exists
      const existingOpeningHour = await this.repository.getOpeningHourByDay(
        input.shopId,
        input.dayOfWeek
      );
      if (existingOpeningHour) {
        throw OpeningHourError.duplicateDay(input.dayOfWeek, input.shopId);
      }

      // Validate time range if opening
      if (input.isOpen && input.openTime && input.closeTime) {
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

      // Create entity
      const openingHourEntity = OpeningHourEntity.create(
        input.shopId,
        input.dayOfWeek,
        input.isOpen,
        input.openTime,
        input.closeTime,
        input.breakStart,
        input.breakEnd
      );

      // Save to repository
      const savedOpeningHour = await this.repository.createOpeningHour(
        openingHourEntity
      );

      // Convert entity to DTO
      const openingHourDTO = this.entityToDTO(savedOpeningHour);

      this.logger.info(
        "CreateOpeningHourUseCase: Successfully created opening hour",
        {
          id: openingHourDTO.id,
          shopId: input.shopId,
          dayOfWeek: input.dayOfWeek,
        }
      );

      return {
        openingHour: openingHourDTO,
      };
    } catch (error) {
      this.logger.error(
        "CreateOpeningHourUseCase: Error creating opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to create opening hour", {
        shopId: input.shopId,
        dayOfWeek: input.dayOfWeek,
        originalError: error,
      });
    }
  }

  private validateInput(input: CreateOpeningHourInputDTO): void {
    if (!input.shopId) {
      throw OpeningHourError.validationError("Shop ID is required");
    }

    if (!input.dayOfWeek) {
      throw OpeningHourError.validationError("Day of week is required");
    }

    if (!Object.values(DayOfWeek).includes(input.dayOfWeek)) {
      throw OpeningHourError.validationError("Invalid day of week");
    }

    // If opening, time fields are required
    if (input.isOpen) {
      if (!input.openTime) {
        throw OpeningHourError.validationError(
          "Open time is required when opening"
        );
      }
      if (!input.closeTime) {
        throw OpeningHourError.validationError(
          "Close time is required when opening"
        );
      }
    }

    // If break time is provided, both start and end must be provided
    if (input.breakStart && !input.breakEnd) {
      throw OpeningHourError.validationError(
        "Break end time is required when break start is provided"
      );
    }
    if (!input.breakStart && input.breakEnd) {
      throw OpeningHourError.validationError(
        "Break start time is required when break end is provided"
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
