import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopMapper } from "@/src/application/mappers/backend/shop-mapper";
import {
  CreateShopEntity,
  ShopStatus,
} from "@/src/domain/entities/backend/backend-shop.entity";
import type { BackendShopRepository } from "@/src/domain/repositories/backend/backend-shop-repository";
import {
  BackendShopError,
  BackendShopErrorType,
} from "@/src/domain/repositories/backend/backend-shop-repository";

export interface CreateShopParams {
  name: string;
  description?: string;
  address: string;
  phone: string;
  email?: string;
  ownerId: string;
  categoryIds: string[];
  openingHours: Array<{
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breakStart?: string;
    breakEnd?: string;
  }>;
}

export class CreateShopUseCase implements IUseCase<CreateShopParams, ShopDTO> {
  constructor(private readonly shopRepository: BackendShopRepository) {}

  async execute(params: CreateShopParams): Promise<ShopDTO> {
    try {
      // Validate required fields
      if (!params.name?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          "Shop name is required",
          "CreateShopUseCase.execute",
          { params }
        );
      }

      if (!params.address?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          "Shop address is required",
          "CreateShopUseCase.execute",
          { params }
        );
      }

      if (!params.phone?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          "Shop phone is required",
          "CreateShopUseCase.execute",
          { params }
        );
      }

      if (!params.ownerId?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          "Owner ID is required",
          "CreateShopUseCase.execute",
          { params }
        );
      }

      // Create shop entity
      const createShopEntity: Omit<
        CreateShopEntity,
        "id" | "createdAt" | "updatedAt"
      > = {
        name: params.name.trim(),
        description: params.description?.trim() || "",
        address: params.address.trim(),
        phone: params.phone.trim(),
        email: params.email?.trim() || "",
        ownerId: params.ownerId,
        status: ShopStatus.DRAFT,
        openingHours:
          params.openingHours?.map((hour) => ({
            dayOfWeek: hour.dayOfWeek,
            isOpen: hour.isOpen,
            openTime: hour.openTime || "",
            closeTime: hour.closeTime || "",
            breakStart: hour.breakStart || "",
            breakEnd: hour.breakEnd || "",
          })) || [],
      };

      const createdShop = await this.shopRepository.createShop(
        createShopEntity
      );
      return ShopMapper.toDTO(createdShop);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        "Failed to create shop",
        "CreateShopUseCase.execute",
        { params },
        error
      );
    }
  }
}
