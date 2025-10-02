import { CustomerEntity } from "@/src/domain/entities/shop/customer/customer.entity";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
  ShopCustomerRepository,
} from "@/src/domain/repositories/shop/customer/customer-repository";
import { CustomerMapper } from "@/src/infrastructure/mappers/shop/customer/customer.mapper";
import type {
  GetCustomerByIdSchema,
  GetCustomerByProfileIdSchema,
  RegisterCustomerSchema,
  LinkCustomerToProfileSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer.schema";
import { StandardRepository } from "../../base/standard-repository";
import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";

/**
 * Supabase implementation of the customer repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerRepository
  extends StandardRepository
  implements ShopCustomerRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "Customer");
  }

  /**
   * Get customer by ID
   * @param customerId Customer ID
   * @returns Customer entity
   * @throws ShopCustomerError if the operation fails
   */
  async getCustomerById(customerId: string): Promise<CustomerEntity> {
    try {
      const result = await this.dataSource.callRpc<GetCustomerByIdSchema[]>(
        "get_customer_by_id",
        {
          p_customer_id: customerId,
        }
      );

      if (!result || result.length === 0) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.NOT_FOUND,
          "Customer not found",
          "getCustomerById",
          { customerId }
        );
      }

      // Map schema to entity using the mapper
      return CustomerMapper.toEntity(result[0]);
    } catch (error) {
      this.logger.error("Error getting customer by ID", { error, customerId });
      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error getting customer by ID",
        "getCustomerById",
        { customerId },
        error
      );
    }
  }

  /**
   * Get customer by profile ID
   * @param profileId Profile ID
   * @param shopId Shop ID
   * @returns Customer entity or null if not found
   * @throws ShopCustomerError if the operation fails
   */
  async getCustomerByProfileId(
    profileId: string,
    shopId: string
  ): Promise<CustomerEntity | null> {
    try {
      const result = await this.dataSource.callRpc<
        GetCustomerByProfileIdSchema[]
      >("get_customer_by_profile_id", {
        p_profile_id: profileId,
        p_shop_id: shopId,
      });

      if (!result || result.length === 0) {
        return null;
      }

      // Map schema to entity using the mapper
      return CustomerMapper.toEntity(result[0]);
    } catch (error) {
      this.logger.error("Error getting customer by profile ID", {
        error,
        profileId,
        shopId,
      });
      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error getting customer by profile ID",
        "getCustomerByProfileId",
        { profileId, shopId },
        error
      );
    }
  }

  /**
   * Register a new customer
   * @param shopId Shop ID
   * @param name Customer name
   * @param phone Customer phone
   * @returns Customer registration result
   * @throws ShopCustomerError if the operation fails
   */
  async registerCustomer(
    shopId: string,
    name: string,
    phone: string
  ): Promise<{ customerId: string }> {
    try {
      const result = await this.dataSource.callRpc<RegisterCustomerSchema>(
        "register_customer_with_phone",
        {
          p_shop_id: shopId,
          p_name: name,
          p_phone: phone,
        }
      );

      if (!result) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.OPERATION_FAILED,
          "Failed to register customer",
          "registerCustomer",
          { shopId, name, phone }
        );
      }

      // Map schema to result entity using the mapper
      return CustomerMapper.toRegisterCustomerResultEntity(result);
    } catch (error) {
      this.logger.error("Error registering customer", {
        error,
        shopId,
        name,
        phone,
      });
      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error registering customer",
        "registerCustomer",
        { shopId, name, phone },
        error
      );
    }
  }

  /**
   * Link customer to profile
   * @param customerId Customer ID
   * @param phone Customer phone
   * @returns Link operation result
   * @throws ShopCustomerError if the operation fails
   */
  async linkCustomerToProfile(
    customerId: string,
    phone: string
  ): Promise<{ success: boolean }> {
    try {
      const result = await this.dataSource.callRpc<LinkCustomerToProfileSchema>(
        "link_customer_to_profile",
        {
          p_customer_id: customerId,
          p_phone: phone,
        }
      );

      if (!result) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.OPERATION_FAILED,
          "Failed to link customer to profile",
          "linkCustomerToProfile",
          { customerId, phone }
        );
      }

      // Map schema to result entity using the mapper
      return CustomerMapper.toLinkCustomerToProfileResultEntity(result);
    } catch (error) {
      this.logger.error("Error linking customer to profile", {
        error,
        customerId,
        phone,
      });
      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error linking customer to profile",
        "linkCustomerToProfile",
        { customerId, phone },
        error
      );
    }
  }
}
