import { z } from "zod";
import { IProfileRepositoryAdapter } from "../../interfaces/profile-repository-adapter.interface";
import { IUseCase } from "../../interfaces/use-case.interface";

/**
 * Input type for delete profile use case
 */
export interface DeleteProfileInput {
  id: string;
}

/**
 * Schema for validating input
 */
const deleteProfileSchema = z.object({
  id: z.string().uuid({ message: "Profile ID must be a valid UUID" }),
});

/**
 * Use case for deleting a profile
 * Following the Clean Architecture pattern
 */
export class DeleteProfileUseCase
  implements IUseCase<DeleteProfileInput, void>
{
  /**
   * Constructor with dependency injection
   * @param profileAdapter Adapter for profile operations
   */
  constructor(private readonly profileAdapter: IProfileRepositoryAdapter) {}

  /**
   * Execute the use case to delete a profile
   * @param input Input containing profile ID
   */
  async execute(input: DeleteProfileInput): Promise<void> {
    // Validate input
    deleteProfileSchema.parse(input);

    // Delete profile
    return this.profileAdapter.delete(input.id);
  }
}
