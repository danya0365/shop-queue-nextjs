import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  UpdateCustomerInputDTO,
  UpdateCustomerOutputDTO,
} from "@/src/application/dtos/shop/customer/customer-dto";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
  type ShopCustomerRepository,
} from "@/src/domain/repositories/shop/customer/customer-repository";

export class UpdateCustomerUseCase
  implements IUseCase<UpdateCustomerInputDTO, UpdateCustomerOutputDTO>
{
  constructor(private readonly repository: ShopCustomerRepository) {}

  async execute(input: UpdateCustomerInputDTO): Promise<UpdateCustomerOutputDTO> {
    const {
      customerId,
      name,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      notes,
      isActive,
    } = input;

    // Basic validations
    if (!customerId || customerId.trim().length === 0) {
      throw new ShopCustomerError(
        ShopCustomerErrorType.VALIDATION_ERROR,
        "customerId is required",
        "UpdateCustomerUseCase.execute",
        { input }
      );
    }

    let cleanedPhone: string | undefined = undefined;
    if (phone !== undefined) {
      // Keep only digits for phone, remove spaces, dashes, etc.
      cleanedPhone = phone.replace(/\D/g, "");
      if (!/^\d{10}$/.test(cleanedPhone)) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "invalid phone format",
          "UpdateCustomerUseCase.execute",
          { phone }
        );
      }
    }

    try {
      const entity = await this.repository.updateCustomer({
        customerId,
        name,
        phone: cleanedPhone,
        email: email ?? null,
        dateOfBirth: dateOfBirth ?? null,
        gender: gender ?? null,
        address: address ?? null,
        notes: notes ?? null,
        isActive: isActive ?? null,
      });

      // Map entity to DTO
      const dto: UpdateCustomerOutputDTO = {
        id: entity.id,
        name: entity.name,
        phone: entity.phone,
        shopId: entity.shopId,
        profileId: entity.profileId ?? null,
        createdAt: entity.createdAt,
      };

      return dto;
    } catch (error) {
      if (error instanceof ShopCustomerError) throw error;
      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        error instanceof Error ? error.message : "unknown error",
        "UpdateCustomerUseCase.execute",
        { input },
        error
      );
    }
  }
}
