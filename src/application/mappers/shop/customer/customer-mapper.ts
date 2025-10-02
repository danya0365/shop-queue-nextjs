import type {
  CustomerDTO,
  RegisterCustomerOutputDTO,
  LinkCustomerToProfileOutputDTO,
} from "@/src/application/dtos/shop/customer/customer-dto";
import type {
  CustomerEntity,
  RegisterCustomerResultEntity,
  LinkCustomerToProfileResultEntity,
} from "@/src/domain/entities/shop/customer/customer.entity";

/**
 * Mapper for converting between customer domain entities and DTOs
 * Following Clean Architecture principles
 */
export class CustomerMapper {
  /**
   * Convert CustomerEntity to CustomerDTO
   */
  static toCustomerDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      shopId: entity.shopId,
      profileId: entity.profileId,
    };
  }

  /**
   * Convert RegisterCustomerResultEntity to RegisterCustomerOutputDTO
   */
  static toRegisterCustomerOutputDTO(entity: RegisterCustomerResultEntity): RegisterCustomerOutputDTO {
    return {
      customerId: entity.customerId,
    };
  }

  /**
   * Convert LinkCustomerToProfileResultEntity to LinkCustomerToProfileOutputDTO
   */
  static toLinkCustomerToProfileOutputDTO(entity: LinkCustomerToProfileResultEntity): LinkCustomerToProfileOutputDTO {
    return {
      success: entity.success,
    };
  }

  /**
   * Convert register customer input to entity (for future use)
   */
  static toRegisterCustomerEntity(input: {
    shopId: string;
    name: string;
    phone: string;
  }): Omit<CustomerEntity, 'id' | 'profileId'> {
    return {
      shopId: input.shopId,
      name: input.name,
      phone: input.phone,
    };
  }

  /**
   * Convert link customer to profile input to entity (for future use)
   */
  static toLinkCustomerToProfileEntity(input: {
    customerId: string;
    phone: string;
  }): { customerId: string; phone: string } {
    return {
      customerId: input.customerId,
      phone: input.phone,
    };
  }
}
