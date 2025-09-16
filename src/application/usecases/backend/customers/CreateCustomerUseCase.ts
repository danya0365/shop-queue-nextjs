import { CustomerDTO } from "@/src/application/dtos/backend/customers-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/backend/customer-mapper";
import type { BackendCustomerRepository } from "@/src/domain/repositories/backend/backend-customer-repository";
import {
  BackendCustomerError,
  BackendCustomerErrorType,
} from "@/src/domain/repositories/backend/backend-customer-repository";

export interface CreateCustomerUseCaseInput {
  shopId: string;
  profileId: string;
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export class CreateCustomerUseCase
  implements IUseCase<CreateCustomerUseCaseInput, CustomerDTO>
{
  constructor(private readonly customerRepository: BackendCustomerRepository) {}

  async execute(input: CreateCustomerUseCaseInput): Promise<CustomerDTO> {
    // Validate input
    if (!input.name || input.name.trim() === "") {
      throw new BackendCustomerError(
        BackendCustomerErrorType.VALIDATION_ERROR,
        "Customer name is required",
        "createCustomer"
      );
    }

    const customerData = {
      shopId: input.shopId,
      profileId: input.profileId,
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      dateOfBirth: input.dateOfBirth || null,
      gender: input.gender || null,
      address: input.address || null,
      notes: input.notes || null,
      isActive: input.isActive !== undefined ? input.isActive : true,
    };

    const createdCustomer = await this.customerRepository.createCustomer(
      customerData
    );

    return CustomerMapper.toDTO(createdCustomer);
  }
}
