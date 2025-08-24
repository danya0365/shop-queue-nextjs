// Interface for shop service

import { ShopDto } from "../dtos/shop-dto";

// Follows the Interface Segregation Principle by defining a clear contract
export interface IShopService {
  getShopsByOwnerId(ownerId: string): Promise<ShopDto[]>;
}
