import {
  GetOpeningHoursInput,
  GetOpeningHoursOutput,
  OpeningHourDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class GetOpeningHoursUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: GetOpeningHoursInput): Promise<GetOpeningHoursOutput> {
    try {
      this.logger.info("GetOpeningHoursUseCase: Getting opening hours", {
        shopId: input.shopId,
      });

      // Validate input
      if (!input.shopId) {
        throw OpeningHourError.validationError("Shop ID is required");
      }

      // Get opening hours from repository
      const openingHours = await this.repository.getOpeningHours(input.shopId);

      // Convert entities to DTOs
      const openingHourDTOs: OpeningHourDTO[] = openingHours.map(
        this.entityToDTO
      );

      this.logger.info(
        "GetOpeningHoursUseCase: Successfully retrieved opening hours",
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
        "GetOpeningHoursUseCase: Error getting opening hours",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to get opening hours", {
        shopId: input.shopId,
        originalError: error,
      });
    }
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
