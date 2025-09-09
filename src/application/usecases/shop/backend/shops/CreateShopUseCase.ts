import { CreateShopInputDTO, ShopDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/shop/backend/shop-mapper';
import { CreateShopEntity, ShopStatus } from '@/src/domain/entities/shop/backend/backend-shop.entity';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

export class CreateShopUseCase implements IUseCase<CreateShopInputDTO, ShopDTO> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(params: CreateShopInputDTO): Promise<ShopDTO> {
    try {
      // Validate required fields
      if (!params.name?.trim()) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop name is required',
          'CreateShopUseCase.execute',
          { params }
        );
      }

      if (!params.address?.trim()) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop address is required',
          'CreateShopUseCase.execute',
          { params }
        );
      }

      if (!params.phone?.trim()) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop phone is required',
          'CreateShopUseCase.execute',
          { params }
        );
      }

      if (!params.ownerId?.trim()) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Owner ID is required',
          'CreateShopUseCase.execute',
          { params }
        );
      }

      // Create shop entity
      const createShopEntity: Omit<CreateShopEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        name: params.name.trim(),
        description: params.description?.trim() || '',
        address: params.address.trim(),
        phone: params.phone.trim(),
        email: params.email?.trim() || '',
        ownerId: params.ownerId,
        status: ShopStatus.DRAFT,
        openingHours: params.openingHours?.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          isOpen: hour.isOpen,
          openTime: hour.openTime || '',
          closeTime: hour.closeTime || '',
          breakStart: hour.breakStart || '',
          breakEnd: hour.breakEnd || ''
        })) || []
      };

      const createdShop = await this.shopRepository.createShop(createShopEntity);
      return ShopMapper.toDTO(createdShop);
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to create shop',
        'CreateShopUseCase.execute',
        { params },
        error
      );
    }
  }
}
