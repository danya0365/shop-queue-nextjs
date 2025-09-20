import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { CustomerRewardDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { RedeemRewardInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class RedeemRewardUseCase implements IUseCase<
  RedeemRewardInputDTO,
  CustomerRewardDTO
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: RedeemRewardInputDTO): Promise<CustomerRewardDTO> {
    try {
      const { shopId, customerId, rewardId } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "RedeemRewardUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "RedeemRewardUseCase.execute",
          { customerId }
        );
      }

      if (!rewardId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Reward ID is required",
          "RedeemRewardUseCase.execute",
          { rewardId }
        );
      }

      // Get customer points first to check if they have enough points
      const customerPoints = await this.customerRewardRepository.getCustomerPoints(shopId, customerId);
      
      // Get reward details to check points cost
      const rewardDetails = await this.customerRewardRepository.getRewardById(shopId, rewardId);
      
      if (!rewardDetails) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Reward not found",
          "RedeemRewardUseCase.execute",
          { rewardId }
        );
      }

      // Check if reward is available
      if ('isAvailable' in rewardDetails && !rewardDetails.isAvailable) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.REWARD_UNAVAILABLE,
          "Reward is not available for redemption",
          "RedeemRewardUseCase.execute",
          { rewardId }
        );
      }

      // Check if reward is expired
      if (rewardDetails.expiryDate && new Date(rewardDetails.expiryDate) < new Date()) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.REWARD_EXPIRED,
          "Reward has expired",
          "RedeemRewardUseCase.execute",
          { rewardId, expiryDate: rewardDetails.expiryDate }
        );
      }

      // Check if customer has enough points
      if (customerPoints.currentPoints < rewardDetails.pointsCost) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.INSUFFICIENT_POINTS,
          "Insufficient points to redeem reward",
          "RedeemRewardUseCase.execute",
          { 
            currentPoints: customerPoints.currentPoints, 
            requiredPoints: rewardDetails.pointsCost 
          }
        );
      }

      // Process the redemption
      const redeemedRewardEntity = await this.customerRewardRepository.redeemReward(shopId, customerId, rewardId);
      
      return CustomerRewardMapper.toCustomerRewardDTO(redeemedRewardEntity);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to redeem reward",
        "RedeemRewardUseCase.execute",
        { input },
        error
      );
    }
  }
}
