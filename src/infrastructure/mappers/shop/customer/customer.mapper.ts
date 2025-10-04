// Customer Mapper for entity/DTO transformations
// Following Clean Architecture principles

import { CustomerDTO } from "@/src/application/dtos/shop/customer/customer-dto";
import { CustomerEntity } from "@/src/domain/entities/shop/customer/customer.entity";
import {
  GetCustomerByIdSchema,
  GetCustomerByProfileIdSchema,
  LinkCustomerToProfileSchema,
  RegisterCustomerSchema,
  UpdateCustomerSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer.schema";

/**
 * Mapper class for converting between customer database schemas, entities, and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class CustomerMapper {
  /**
   * Map customer database schema to CustomerEntity
   * @param schema Customer database schema
   * @returns CustomerEntity
   */
  public static toEntity(
    schema: GetCustomerByIdSchema | GetCustomerByProfileIdSchema | UpdateCustomerSchema
  ): CustomerEntity {
    return {
      id: schema.id || "",
      name: schema.name || "",
      phone: schema.phone || "",
      shopId: schema.shop_id || "",
      profileId: schema.profile_id || null,
      createdAt: schema.created_at || "",
    };
  }

  /**
   * Map CustomerEntity to CustomerDTO
   * @param entity CustomerEntity
   * @returns CustomerDTO
   */
  public static toDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      shopId: entity.shopId,
      profileId: entity.profileId,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Map customer database schema directly to CustomerDTO
   * @param schema Customer database schema
   * @returns CustomerDTO
   */
  public static toDTOFromSchema(
    schema: GetCustomerByIdSchema | GetCustomerByProfileIdSchema
  ): CustomerDTO {
    const entity = this.toEntity(schema);
    return this.toDTO(entity);
  }

  /**
   * Map register customer result to RegisterCustomerResultEntity
   * @param schema Register customer result schema
   * @returns RegisterCustomerResultEntity
   */
  public static toRegisterCustomerResultEntity(
    schema: RegisterCustomerSchema
  ): { customerId: string } {
    // RegisterCustomerSchema is now the direct return type (UUID string)
    return {
      customerId: typeof schema === "string" ? schema : "",
    };
  }

  /**
   * Map link customer to profile result to LinkCustomerToProfileResultEntity
   * @param schema Link customer to profile result schema
   * @returns LinkCustomerToProfileResultEntity
   */
  public static toLinkCustomerToProfileResultEntity(
    schema: LinkCustomerToProfileSchema
  ): { success: boolean } {
    // LinkCustomerToProfileSchema is now the direct return type (boolean)
    return {
      success: typeof schema === "boolean" ? schema : true,
    };
  }
}
