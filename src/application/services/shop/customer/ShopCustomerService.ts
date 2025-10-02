import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  CustomerDTO,
  GetCustomerByIdInputDTO,
  GetCustomerByProfileIdInputDTO,
  RegisterCustomerInputDTO,
  RegisterCustomerOutputDTO,
  LinkCustomerToProfileInputDTO,
  LinkCustomerToProfileOutputDTO,
} from "@/src/application/dtos/shop/customer/customer-dto";
import { GetCustomerByIdUseCase } from "@/src/application/usecases/shop/customer/customer/GetCustomerByIdUseCase";
import { GetCustomerByProfileIdUseCase } from "@/src/application/usecases/shop/customer/customer/GetCustomerByProfileIdUseCase";
import { RegisterCustomerUseCase } from "@/src/application/usecases/shop/customer/customer/RegisterCustomerUseCase";
import { LinkCustomerToProfileUseCase } from "@/src/application/usecases/shop/customer/customer/LinkCustomerToProfileUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";

export interface IShopCustomerService {
  /**
   * Get customer by ID
   * @param customerId The customer ID
   * @returns Customer data
   */
  getCustomerById(customerId: string): Promise<CustomerDTO>;

  /**
   * Get customer by profile ID and shop ID
   * @param profileId The profile ID
   * @param shopId The shop ID
   * @returns Customer data or null if not found
   */
  getCustomerByProfileId(profileId: string, shopId: string): Promise<CustomerDTO | null>;

  /**
   * Register a new customer
   * @param shopId The shop ID
   * @param name The customer name
   * @param phone The customer phone number
   * @returns Registration result with customer ID
   */
  registerCustomer(shopId: string, name: string, phone: string): Promise<RegisterCustomerOutputDTO>;

  /**
   * Link customer to profile
   * @param customerId The customer ID
   * @param phone The customer phone number
   * @returns Link result
   */
  linkCustomerToProfile(customerId: string, phone: string): Promise<LinkCustomerToProfileOutputDTO>;
}

export class ShopCustomerService implements IShopCustomerService {
  constructor(
    private readonly getCustomerByIdUseCase: IUseCase<GetCustomerByIdInputDTO, CustomerDTO>,
    private readonly getCustomerByProfileIdUseCase: IUseCase<GetCustomerByProfileIdInputDTO, CustomerDTO | null>,
    private readonly registerCustomerUseCase: IUseCase<RegisterCustomerInputDTO, RegisterCustomerOutputDTO>,
    private readonly linkCustomerToProfileUseCase: IUseCase<LinkCustomerToProfileInputDTO, LinkCustomerToProfileOutputDTO>,
    private readonly logger: Logger
  ) {}

  async getCustomerById(customerId: string): Promise<CustomerDTO> {
    try {
      this.logger.info("Getting customer by ID", { customerId });

      const result = await this.getCustomerByIdUseCase.execute({ customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer by ID", { error, customerId });
      throw error;
    }
  }

  async getCustomerByProfileId(profileId: string, shopId: string): Promise<CustomerDTO | null> {
    try {
      this.logger.info("Getting customer by profile ID", { profileId, shopId });

      const result = await this.getCustomerByProfileIdUseCase.execute({ profileId, shopId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer by profile ID", { error, profileId, shopId });
      throw error;
    }
  }

  async registerCustomer(shopId: string, name: string, phone: string): Promise<RegisterCustomerOutputDTO> {
    try {
      this.logger.info("Registering customer", { shopId, name, phone });

      const result = await this.registerCustomerUseCase.execute({ shopId, name, phone });
      return result;
    } catch (error) {
      this.logger.error("Error registering customer", { error, shopId, name, phone });
      throw error;
    }
  }

  async linkCustomerToProfile(customerId: string, phone: string): Promise<LinkCustomerToProfileOutputDTO> {
    try {
      this.logger.info("Linking customer to profile", { customerId, phone });

      const result = await this.linkCustomerToProfileUseCase.execute({ customerId, phone });
      return result;
    } catch (error) {
      this.logger.error("Error linking customer to profile", { error, customerId, phone });
      throw error;
    }
  }
}

export class ShopCustomerServiceFactory {
  static create(repository: ShopCustomerQueueJoinRepository, logger: Logger): ShopCustomerService {
    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(repository);
    const getCustomerByProfileIdUseCase = new GetCustomerByProfileIdUseCase(repository);
    const registerCustomerUseCase = new RegisterCustomerUseCase(repository);
    const linkCustomerToProfileUseCase = new LinkCustomerToProfileUseCase(repository);
    
    return new ShopCustomerService(
      getCustomerByIdUseCase,
      getCustomerByProfileIdUseCase,
      registerCustomerUseCase,
      linkCustomerToProfileUseCase,
      logger
    );
  }
}
