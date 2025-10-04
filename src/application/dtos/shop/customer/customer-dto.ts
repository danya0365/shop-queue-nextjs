// DTOs for customer operations
// Following Clean Architecture principles

export interface CustomerDTO {
  id: string;
  name: string;
  phone: string;
  shopId: string;
  profileId?: string | null;
  createdAt: string;
}

export interface GetCustomerByIdInputDTO {
  customerId: string;
}

export interface GetCustomerByProfileIdInputDTO {
  profileId: string;
  shopId: string;
}

export interface RegisterCustomerInputDTO {
  shopId: string;
  name: string;
  phone: string;
}

export interface RegisterCustomerOutputDTO {
  customerId: string;
}

export interface LinkCustomerToProfileInputDTO {
  customerId: string;
  phone: string;
}

export interface LinkCustomerToProfileOutputDTO {
  success: boolean;
}

// Update customer
export interface UpdateCustomerInputDTO {
  customerId: string;
  name?: string;
  phone?: string;
  email?: string | null;
  dateOfBirth?: string | null; // ISO date string
  gender?: string | null;
  address?: string | null;
  notes?: string | null;
  isActive?: boolean | null;
}

export type UpdateCustomerOutputDTO = CustomerDTO;
