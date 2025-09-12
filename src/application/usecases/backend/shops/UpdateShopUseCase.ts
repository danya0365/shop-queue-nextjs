import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopMapper } from "@/src/application/mappers/backend/shop-mapper";
import {
  ShopStatus,
  UpdateShopEntity,
} from "@/src/domain/entities/backend/backend-shop.entity";
import type { BackendShopRepository } from "@/src/domain/repositories/backend/backend-shop-repository";
import {
  BackendShopError,
  BackendShopErrorType,
} from "@/src/domain/repositories/backend/backend-shop-repository";

export interface UpdateShopParams {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: ShopStatus;
  openingHours?: Array<{
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breakStart?: string;
    breakEnd?: string;
  }>;
}

export class UpdateShopUseCase implements IUseCase<UpdateShopParams, ShopDTO> {
  constructor(private readonly shopRepository: BackendShopRepository) {}

  async execute(params: UpdateShopParams): Promise<ShopDTO> {
    try {
      // Validate required fields
      if (!params.id?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "UpdateShopUseCase.execute",
          { params }
        );
      }

      // Check if shop exists
      const existingShop = await this.shopRepository.getShopById(params.id);
      if (!existingShop) {
        throw new BackendShopError(
          BackendShopErrorType.NOT_FOUND,
          `Shop with ID ${params.id} not found`,
          "UpdateShopUseCase.execute",
          { params }
        );
      }

      // Build update entity with only provided fields
      const updateShopEntity: Partial<
        Omit<UpdateShopEntity, "id" | "createdAt" | "updatedAt">
      > = {};

      if (params.name !== undefined) {
        if (!params.name.trim()) {
          throw new BackendShopError(
            BackendShopErrorType.VALIDATION_ERROR,
            "Shop name cannot be empty",
            "UpdateShopUseCase.execute",
            { params }
          );
        }
        updateShopEntity.name = params.name.trim();
      }

      if (params.description !== undefined) {
        updateShopEntity.description = params.description?.trim();
      }

      if (params.address !== undefined) {
        if (!params.address.trim()) {
          throw new BackendShopError(
            BackendShopErrorType.VALIDATION_ERROR,
            "Shop address cannot be empty",
            "UpdateShopUseCase.execute",
            { params }
          );
        }
        updateShopEntity.address = params.address.trim();
      }

      if (params.phone !== undefined) {
        if (!params.phone.trim()) {
          throw new BackendShopError(
            BackendShopErrorType.VALIDATION_ERROR,
            "Shop phone cannot be empty",
            "UpdateShopUseCase.execute",
            { params }
          );
        }
        updateShopEntity.phone = params.phone.trim();
      }

      if (params.email !== undefined) {
        updateShopEntity.email = params.email?.trim();
      }

      if (params.status !== undefined) {
        updateShopEntity.status = params.status;
      }

      if (params.openingHours !== undefined) {
        updateShopEntity.openingHours = params.openingHours.map((hour) => ({
          dayOfWeek: hour.dayOfWeek,
          isOpen: hour.isOpen,
          openTime: hour.openTime || "",
          closeTime: hour.closeTime || "",
          breakStart: hour.breakStart || "",
          breakEnd: hour.breakEnd || "",
        }));
      }

      const updatedShop = await this.shopRepository.updateShop(
        params.id,
        updateShopEntity
      );
      return ShopMapper.toDTO(updatedShop);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        "Failed to update shop",
        "UpdateShopUseCase.execute",
        { params },
        error
      );
    }
  }
}
