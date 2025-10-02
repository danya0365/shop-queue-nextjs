import type { IShopCustomerService } from "@/src/application/services/shop/customer/ShopCustomerService";
import { ShopService } from "@/src/application/services/shop/ShopService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";

/**
 * Base presenter for customer-related operations
 * Contains common customer methods that are shared across different presenters
 */
export class CustomerPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: ShopService,
    protected readonly shopCustomerService: IShopCustomerService
  ) {
    super(logger, shopService);
  }

  /**
   * Get customer by profile ID
   */
  async getCustomerByProfileId(profileId: string, shopId: string) {
    try {
      this.logger.info("Getting customer by profile ID", { profileId, shopId });
      const customer = await this.shopCustomerService.getCustomerByProfileId(
        profileId,
        shopId
      );
      return customer;
    } catch (error) {
      this.logger.error("Error getting customer by profile ID", {
        error,
        profileId,
        shopId,
      });
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string) {
    try {
      this.logger.info("Getting customer by ID", { customerId });
      const customer = await this.shopCustomerService.getCustomerById(
        customerId
      );
      return customer;
    } catch (error) {
      this.logger.error("Error getting customer by ID", { error, customerId });
      throw error;
    }
  }

  /**
   * Register a new customer
   */
  async registerCustomer(shopId: string, name: string, phone: string) {
    try {
      this.logger.info("Registering customer", { shopId, name, phone });
      const result = await this.shopCustomerService.registerCustomer(
        shopId,
        name,
        phone
      );
      return result;
    } catch (error) {
      this.logger.error("Error registering customer", {
        error,
        shopId,
        name,
        phone,
      });
      throw error;
    }
  }

  /**
   * Link customer to profile
   */
  async linkCustomerToProfile(customerId: string, phone: string) {
    try {
      this.logger.info("Linking customer to profile", { customerId, phone });
      const result = await this.shopCustomerService.linkCustomerToProfile(
        customerId,
        phone
      );
      return result;
    } catch (error) {
      this.logger.error("Error linking customer to profile", {
        error,
        customerId,
        phone,
      });
      throw error;
    }
  }
}

// Factory class for server-side
export class CustomerPresenterFactory {
  static async create(): Promise<CustomerPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const shopCustomerService = serverContainer.resolve<IShopCustomerService>("ShopCustomerService");
    
    return new CustomerPresenter(
      logger,
      shopService,
      shopCustomerService
    );
  }
}

// Factory class for client-side
export class ClientCustomerPresenterFactory {
  static create(): CustomerPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const shopCustomerService = clientContainer.resolve<IShopCustomerService>("ShopCustomerService");
    
    return new CustomerPresenter(
      logger,
      shopService,
      shopCustomerService
    );
  }
}
