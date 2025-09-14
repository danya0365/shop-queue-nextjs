import {
  DeleteOpeningHourInput,
  DeleteOpeningHourOutput,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHourError } from "@/src/domain/errors/opening-hour-error";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export class DeleteOpeningHourUseCase {
  constructor(
    private readonly repository: ShopBackendOpeningHoursRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    input: DeleteOpeningHourInput
  ): Promise<DeleteOpeningHourOutput> {
    try {
      this.logger.info("DeleteOpeningHourUseCase: Deleting opening hour", {
        id: input.id,
      });

      // Validate input
      if (!input.id) {
        throw OpeningHourError.validationError("Opening hour ID is required");
      }

      // Check if opening hour exists
      const existingOpeningHour = await this.repository.getOpeningHourById(
        input.id
      );
      if (!existingOpeningHour) {
        throw OpeningHourError.notFound(input.id);
      }

      // Delete from repository
      const success = await this.repository.deleteOpeningHour(input.id);

      if (!success) {
        throw OpeningHourError.databaseError("Failed to delete opening hour", {
          id: input.id,
        });
      }

      this.logger.info(
        "DeleteOpeningHourUseCase: Successfully deleted opening hour",
        {
          id: input.id,
          shopId: existingOpeningHour.shopId,
          dayOfWeek: existingOpeningHour.dayOfWeek,
        }
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(
        "DeleteOpeningHourUseCase: Error deleting opening hour",
        error
      );

      if (error instanceof OpeningHourError) {
        throw error;
      }

      throw OpeningHourError.databaseError("Failed to delete opening hour", {
        id: input.id,
        originalError: error,
      });
    }
  }
}
