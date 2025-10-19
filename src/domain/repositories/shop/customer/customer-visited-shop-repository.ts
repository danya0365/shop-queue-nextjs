import type {
  GetVisitedShopsByProfileParams,
  VisitedShopsResultEntity,
} from "@/src/domain/entities/shop/customer/customer-visited-shop.entity";

export enum ShopCustomerVisitedShopsErrorType {
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  VALIDATION_ERROR = "validation_error",
  OPERATION_FAILED = "operation_failed",
  UNKNOWN = "unknown",
}

export class ShopCustomerVisitedShopsError extends Error {
  constructor(
    public readonly type: ShopCustomerVisitedShopsErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopCustomerVisitedShopsError";
  }
}

export interface ShopCustomerVisitedShopsRepository {
  getVisitedShopsByProfile(
    params: GetVisitedShopsByProfileParams
  ): Promise<VisitedShopsResultEntity>;
}
