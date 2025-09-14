import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";
import {
  DayOfWeek,
  OpeningHourEntity,
} from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import {
  OpeningHourSchema,
} from "@/src/infrastructure/schemas/shop/backend/opening-hour.schema";

export class SupabaseBackendOpeningHourMapper {
  static toEntity(schema: OpeningHourSchema): OpeningHourEntity {
    // Convert string day_of_week to DayOfWeek enum
    const dayOfWeek =
      schema.day_of_week.toUpperCase() as keyof typeof DayOfWeek;
    const dayOfWeekEnum = DayOfWeek[dayOfWeek];

    return new OpeningHourEntity(
      schema.id,
      schema.shop_id,
      dayOfWeekEnum,
      schema.is_open,
      schema.open_time,
      schema.close_time,
      schema.break_start,
      schema.break_end,
      new Date(schema.created_at),
      new Date(schema.updated_at)
    );
  }

  static toCreateSchema(
    entity: OpeningHourEntity
  ): Omit<OpeningHourSchema, 'id' | 'created_at' | 'updated_at'> {
    return {
      shop_id: entity.shopId,
      day_of_week: entity.dayOfWeek,
      is_open: entity.isOpen,
      open_time: entity.openTime,
      close_time: entity.closeTime,
      break_start: entity.breakStart,
      break_end: entity.breakEnd,
    };
  }

  static toUpdateSchema(
    entity: OpeningHourEntity
  ): Partial<Omit<OpeningHourSchema, 'id' | 'shop_id' | 'day_of_week' | 'created_at' | 'updated_at'>> {
    return {
      is_open: entity.isOpen,
      open_time: entity.openTime,
      close_time: entity.closeTime,
      break_start: entity.breakStart,
      break_end: entity.breakEnd,
    };
  }

  static toDTO(entity: OpeningHourEntity): OpeningHourDTO {
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

  static toEntityFromDTO(dto: OpeningHourDTO): OpeningHourEntity {
    // Convert string dayOfWeek to DayOfWeek enum
    const dayOfWeek = dto.dayOfWeek.toUpperCase() as keyof typeof DayOfWeek;
    const dayOfWeekEnum = DayOfWeek[dayOfWeek];

    return new OpeningHourEntity(
      dto.id,
      dto.shopId,
      dayOfWeekEnum,
      dto.isOpen,
      dto.openTime,
      dto.closeTime,
      dto.breakStart,
      dto.breakEnd,
      dto.createdAt,
      dto.updatedAt
    );
  }
}
