import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerRepository } from "@/src/domain/repositories/shop/customer/customer-repository";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
} from "@/src/domain/repositories/shop/customer/customer-repository";
import type { GetCustomerByProfileIdInputDTO, CustomerDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class GetCustomerByProfileIdUseCase implements IUseCase<GetCustomerByProfileIdInputDTO, CustomerDTO | null> {
  constructor(
    private readonly customerRepository: ShopCustomerRepository
  ) {}

  async execute(input: GetCustomerByProfileIdInputDTO): Promise<CustomerDTO | null> {
    const { profileId, shopId } = input;

    try {
      // Validate input
      if (!profileId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Profile ID is required",
          "GetCustomerByProfileIdUseCase.execute",
          { profileId, shopId }
        );
      }

      if (!shopId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerByProfileIdUseCase.execute",
          { profileId, shopId }
        );
      }

      // Get customer from repository
      const customerEntity = await this.customerRepository.getCustomerByProfileId(profileId, shopId);

      if (!customerEntity) {
        return null;
      }

      // Map entity to DTO
      return CustomerMapper.toCustomerDTO(customerEntity);
    } catch (error) {
      if (error instanceof ShopCustomerError) {
        throw error;
      }

      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        "Failed to get customer by profile ID",
        "GetCustomerByProfileIdUseCase.execute",
        { profileId, shopId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
