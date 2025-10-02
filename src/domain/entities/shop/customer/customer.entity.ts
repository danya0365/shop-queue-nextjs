// Customer Domain Entities following Clean Architecture principles

export interface CustomerEntity {
  id: string;
  name: string;
  phone: string;
  shopId: string;
  profileId?: string | null;
}

export interface RegisterCustomerResultEntity {
  customerId: string;
}

export interface LinkCustomerToProfileResultEntity {
  success: boolean;
}
