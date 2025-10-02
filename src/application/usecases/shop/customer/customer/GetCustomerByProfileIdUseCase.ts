import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { GetCustomerByProfileIdInputDTO, CustomerDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class GetCustomerByProfileIdUseCase implements IUseCase<GetCustomerByProfileIdInputDTO, CustomerDTO | null> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: GetCustomerByProfileIdInputDTO): Promise<CustomerDTO | null> {
    const { profileId, shopId } = input;

    try {
      // Validate input
      if (!profileId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Profile ID is required",
          "GetCustomerByProfileIdUseCase.execute",
          { profileId, shopId }
        );
      }

      if (!shopId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerByProfileIdUseCase.execute",
          { profileId, shopId }
        );
      }

      // Get customer from repository
      const customerEntity = await this.customerQueueJoinRepository.getCustomerByProfileId(profileId, shopId);

      if (!customerEntity) {
        return null;
      }

      // Map entity to DTO
      return CustomerMapper.toCustomerDTO(customerEntity);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to get customer by profile ID",
        "GetCustomerByProfileIdUseCase.execute",
        { profileId, shopId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
