import {
  GetOpeningHourByIdInput,
  GetOpeningHourByIdOutput,
  OpeningHourDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHourEntity } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class GetOpeningHourByIdUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    input: GetOpeningHourByIdInput
  ): Promise<GetOpeningHourByIdOutput> {
    try {
      this.logger.info(
        "GetOpeningHourByIdUseCase: Getting opening hour by ID",
        { id: input.id }
      );

      // Validate input
      if (!input.id) {
        throw OpeningHourError.validationError("Opening hour ID is required");
      }

      // Get opening hour from repository
      const openingHour = await this.repository.getOpeningHourById(input.id);

      if (!openingHour) {
        throw OpeningHourError.notFound(input.id);
      }

      // Convert entity to DTO
      const openingHourDTO = this.entityToDTO(openingHour);

      this.logger.info(
        "GetOpeningHourByIdUseCase: Successfully retrieved opening hour",
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
        "GetOpeningHourByIdUseCase: Error getting opening hour by ID",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to get opening hour by ID", {
        id: input.id,
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
