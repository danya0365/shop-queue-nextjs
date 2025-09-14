import {
  BulkUpdateOpeningHourInputDTO,
  CreateOpeningHourInputDTO,
  OpeningHourDTO,
  UpdateOpeningHourInputDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import {
  BulkUpdateOpeningHoursUseCase,
  CreateOpeningHourUseCase,
  DeleteOpeningHourUseCase,
  GetOpeningHourByIdUseCase,
  GetOpeningHoursUseCase,
  UpdateOpeningHourUseCase,
} from "@/src/application/usecases/shop/backend/opening-hours";
import { DayOfWeek } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendOpeningHoursRepository } from "@/src/domain/repositories/shop/backend/backend-opening-hours-repository";

export interface IShopBackendOpeningHoursService {
  getOpeningHours(shopId: string): Promise<OpeningHourDTO[]>;
  getOpeningHourById(
    shopId: string,
    hourId: string
  ): Promise<OpeningHourDTO | null>;
  createOpeningHour(
    shopId: string,
    data: CreateOpeningHourInputDTO
  ): Promise<OpeningHourDTO>;
  updateOpeningHour(
    shopId: string,
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ): Promise<OpeningHourDTO>;
  deleteOpeningHour(shopId: string, hourId: string): Promise<boolean>;
  bulkUpdateOpeningHours(
    shopId: string,
    hours: BulkUpdateOpeningHourInputDTO[]
  ): Promise<OpeningHourDTO[]>;
  getWeeklySchedule(shopId: string): Promise<Record<string, OpeningHourDTO>>;
}

export class ShopBackendOpeningHoursService
  implements IShopBackendOpeningHoursService
{
  constructor(
    private readonly logger: Logger,
    private readonly getOpeningHoursUseCase: GetOpeningHoursUseCase,
    private readonly getOpeningHourByIdUseCase: GetOpeningHourByIdUseCase,
    private readonly createOpeningHourUseCase: CreateOpeningHourUseCase,
    private readonly updateOpeningHourUseCase: UpdateOpeningHourUseCase,
    private readonly deleteOpeningHourUseCase: DeleteOpeningHourUseCase,
    private readonly bulkUpdateOpeningHoursUseCase: BulkUpdateOpeningHoursUseCase
  ) {}

  private dtoToOpeningHour(dto: OpeningHourDTO): OpeningHourDTO {
    return {
      id: dto.id,
      shopId: dto.shopId,
      dayOfWeek: dto.dayOfWeek,
      isOpen: dto.isOpen,
      openTime: dto.openTime,
      closeTime: dto.closeTime,
      breakStart: dto.breakStart,
      breakEnd: dto.breakEnd,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  async getOpeningHours(shopId: string): Promise<OpeningHourDTO[]> {
    this.logger.info("OpeningHoursBackendService: Getting opening hours", {
      shopId,
    });

    const result = await this.getOpeningHoursUseCase.execute({ shopId });
    return result.openingHours;
  }

  async getOpeningHourById(
    shopId: string,
    hourId: string
  ): Promise<OpeningHourDTO | null> {
    this.logger.info("OpeningHoursBackendService: Getting opening hour by ID", {
      shopId,
      hourId,
    });

    const result = await this.getOpeningHourByIdUseCase.execute({ id: hourId });
    return result.openingHour
      ? this.dtoToOpeningHour(result.openingHour)
      : null;
  }

  async createOpeningHour(
    shopId: string,
    data: CreateOpeningHourInputDTO
  ): Promise<OpeningHourDTO> {
    this.logger.info("OpeningHoursBackendService: Creating opening hour", {
      shopId,
      data,
    });

    const result = await this.createOpeningHourUseCase.execute({
      shopId,
      dayOfWeek: data.dayOfWeek as DayOfWeek,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
      breakStart: data.breakStart,
      breakEnd: data.breakEnd,
    });

    return this.dtoToOpeningHour(result.openingHour);
  }

  async updateOpeningHour(
    shopId: string,
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ): Promise<OpeningHourDTO> {
    this.logger.info("OpeningHoursBackendService: Updating opening hour", {
      shopId,
      hourId,
      data,
    });

    const result = await this.updateOpeningHourUseCase.execute({
      id: hourId,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
      breakStart: data.breakStart,
      breakEnd: data.breakEnd,
    });

    return this.dtoToOpeningHour(result.openingHour);
  }

  async deleteOpeningHour(shopId: string, hourId: string): Promise<boolean> {
    this.logger.info("OpeningHoursBackendService: Deleting opening hour", {
      shopId,
      hourId,
    });

    const result = await this.deleteOpeningHourUseCase.execute({ id: hourId });
    return result.success;
  }

  async bulkUpdateOpeningHours(
    shopId: string,
    hours: BulkUpdateOpeningHourInputDTO[]
  ): Promise<OpeningHourDTO[]> {
    this.logger.info(
      "OpeningHoursBackendService: Bulk updating opening hours",
      { shopId, count: hours.length }
    );

    const result = await this.bulkUpdateOpeningHoursUseCase.execute({
      shopId,
      openingHours: hours,
    });

    return result.openingHours.map((dto) => this.dtoToOpeningHour(dto));
  }

  async getWeeklySchedule(
    shopId: string
  ): Promise<Record<string, OpeningHourDTO>> {
    this.logger.info("OpeningHoursBackendService: Getting weekly schedule", {
      shopId,
    });

    const hours = await this.getOpeningHours(shopId);
    const schedule: Record<string, OpeningHourDTO> = {};

    hours.forEach((hour) => {
      schedule[hour.dayOfWeek] = hour;
    });

    return schedule;
  }
}

export class OpeningHoursBackendServiceFactory {
  static create(
    repository: ShopBackendOpeningHoursRepository,
    logger: Logger
  ): ShopBackendOpeningHoursService {
    const getOpeningHoursUseCase = new GetOpeningHoursUseCase(
      repository,
      logger
    );
    const getOpeningHourByIdUseCase = new GetOpeningHourByIdUseCase(
      repository,
      logger
    );
    const createOpeningHourUseCase = new CreateOpeningHourUseCase(
      repository,
      logger
    );
    const updateOpeningHourUseCase = new UpdateOpeningHourUseCase(
      repository,
      logger
    );
    const deleteOpeningHourUseCase = new DeleteOpeningHourUseCase(
      repository,
      logger
    );
    const bulkUpdateOpeningHoursUseCase = new BulkUpdateOpeningHoursUseCase(
      repository,
      logger
    );

    return new ShopBackendOpeningHoursService(
      logger,
      getOpeningHoursUseCase,
      getOpeningHourByIdUseCase,
      createOpeningHourUseCase,
      updateOpeningHourUseCase,
      deleteOpeningHourUseCase,
      bulkUpdateOpeningHoursUseCase
    );
  }
}
