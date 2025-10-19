import type { VisitedShopsDataDTO, GetVisitedShopsByProfileInputDTO } from "@/src/application/dtos/shop/customer/customer-visited-shops-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerVisitedShopsRepository } from "@/src/domain/repositories/shop/customer/customer-visited-shop-repository";
import { GetVisitedShopsByProfileUseCase } from "@/src/application/usecases/shop/customer/visited-shops/GetVisitedShopsByProfileUseCase";

export interface IShopCustomerVisitedShopsService {
  getVisitedShopsByProfile(
    input: GetVisitedShopsByProfileInputDTO
  ): Promise<VisitedShopsDataDTO>;
}

export class ShopCustomerVisitedShopsService implements IShopCustomerVisitedShopsService {
  constructor(
    private readonly getVisitedShopsByProfileUseCase: IUseCase<
      GetVisitedShopsByProfileInputDTO,
      VisitedShopsDataDTO
    >,
    private readonly logger: Logger
  ) {}

  async getVisitedShopsByProfile(
    input: GetVisitedShopsByProfileInputDTO
  ): Promise<VisitedShopsDataDTO> {
    try {
      this.logger.info("ShopCustomerVisitedShopsService: fetching visited shops", {
        profileId: input.profileId,
        page: input.page,
        limit: input.limit,
      });

      return await this.getVisitedShopsByProfileUseCase.execute(input);
    } catch (error) {
      this.logger.error(
        "ShopCustomerVisitedShopsService: failed to fetch visited shops",
        {
          error,
          profileId: input.profileId,
        }
      );
      throw error;
    }
  }
}

export class ShopCustomerVisitedShopsServiceFactory {
  static create(
    repository: ShopCustomerVisitedShopsRepository,
    logger: Logger
  ): ShopCustomerVisitedShopsService {
    const getVisitedShopsByProfileUseCase = new GetVisitedShopsByProfileUseCase(
      repository
    );

    return new ShopCustomerVisitedShopsService(
      getVisitedShopsByProfileUseCase,
      logger
    );
  }
}
