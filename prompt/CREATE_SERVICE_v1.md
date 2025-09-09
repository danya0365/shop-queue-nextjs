# Create Service Template - Clean Architecture Pattern

## Prompt Template for Creating New Services

Use this prompt template to create new services following Clean Architecture and SOLID principles, similar to the BackendShopsService implementation.

---

## **Base Prompt Structure**

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/services/shop/backend/BackendShopsService.ts

แล้วช่วยสร้าง service สำหรับ [ENTITY_NAME] ด้วยคับ

โดยที่ให้ทำตาม Clean Architecture และ SOLID principles

ตัวอย่าง DTOs /Users/marosdeeuma/shop-queue-nextjs/src/application/dtos/shop/backend/shops-dto.ts

ตัวอย่าง UseCase /Users/marosdeeuma/shop-queue-nextjs/src/application/usecases/shop/backend/shops/GetShopsPaginatedUseCase.ts
```

---

## **Implementation Pattern**

### **1. Service Interface**
**Location**: `/src/application/services/[module]/backend/Backend[Entity]sService.ts`

**Structure**:
```typescript
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { 
  Get[Entity]sPaginatedInput, 
  Paginated[Entity]sDTO, 
  [Entity]DTO, 
  [Entity]StatsDTO, 
  [Entity]sDataDTO 
} from '@/src/application/dtos/[module]/backend/[entity]s-dto';

// Define parameter types for create/update operations
export type Create[Entity]Params = {
  // Define creation parameters
};

export type Update[Entity]Params = {
  id: string;
  // Define update parameters
};

/**
 * Service interface for [entity] operations
 * Following Interface Segregation Principle
 */
export interface I[Entity]Backend[Entity]sService {
  /**
   * Get [entity]s data including paginated [entity]s and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns [Entity]s data DTO
   */
  get[Entity]sData(page?: number, perPage?: number): Promise<[Entity]sDataDTO>;

  /**
   * Get paginated [entity]s
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Paginated [entity]s DTO
   */
  get[Entity]sPaginated(page?: number, perPage?: number): Promise<Paginated[Entity]sDTO>;

  /**
   * Get [entity] statistics
   * @returns [Entity] statistics DTO
   */
  get[Entity]Stats(): Promise<[Entity]StatsDTO>;

  /**
   * Get [entity] by ID
   * @param id [Entity] ID
   * @returns [Entity] DTO
   */
  get[Entity]ById(id: string): Promise<[Entity]DTO>;

  /**
   * Create a new [entity]
   * @param params Creation parameters
   * @returns Created [entity] DTO
   */
  create[Entity](params: Create[Entity]Params): Promise<[Entity]DTO>;

  /**
   * Update an existing [entity]
   * @param params Update parameters
   * @returns Updated [entity] DTO
   */
  update[Entity](params: Update[Entity]Params): Promise<[Entity]DTO>;

  /**
   * Delete a [entity]
   * @param id [Entity] ID
   * @returns true if deleted successfully
   */
  delete[Entity](id: string): Promise<boolean>;
}
```

### **2. Service Implementation**
**Location**: Same file as interface

**Structure**:
```typescript
/**
 * Service implementation for [entity] operations
 * Following Clean Architecture and SOLID principles
 */
export class [Entity]Backend[Entity]sService implements I[Entity]Backend[Entity]sService {
  constructor(
    private readonly get[Entity]sPaginatedUseCase: IUseCase<Get[Entity]sPaginatedInput, Paginated[Entity]sDTO>,
    private readonly get[Entity]StatsUseCase: IUseCase<void, [Entity]StatsDTO>,
    private readonly get[Entity]ByIdUseCase: IUseCase<string, [Entity]DTO>,
    private readonly create[Entity]UseCase: IUseCase<Create[Entity]Params, [Entity]DTO>,
    private readonly update[Entity]UseCase: IUseCase<Update[Entity]Params, [Entity]DTO>,
    private readonly delete[Entity]UseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get [entity]s data including paginated [entity]s and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns [Entity]s data DTO
   */
  async get[Entity]sData(page: number = 1, perPage: number = 10): Promise<[Entity]sDataDTO> {
    try {
      this.logger.info('Getting [entity]s data', { page, perPage });

      // Get [entity]s and stats in parallel
      const [[entity]sResult, stats] = await Promise.all([
        this.get[Entity]sPaginatedUseCase.execute({ page, limit: perPage }),
        this.get[Entity]StatsUseCase.execute()
      ]);

      return {
        [entity]s: [entity]sResult.data,
        stats,
        totalCount: [entity]sResult.pagination.totalItems,
        currentPage: [entity]sResult.pagination.currentPage,
        perPage: [entity]sResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting [entity]s data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get paginated [entity]s
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Paginated [entity]s DTO
   */
  async get[Entity]sPaginated(page: number = 1, perPage: number = 10): Promise<Paginated[Entity]sDTO> {
    try {
      this.logger.info('Getting paginated [entity]s data', { page, perPage });

      const result = await this.get[Entity]sPaginatedUseCase.execute({ page, limit: perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated [entity]s data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get [entity] statistics
   * @returns [Entity] statistics DTO
   */
  async get[Entity]Stats(): Promise<[Entity]StatsDTO> {
    try {
      this.logger.info('Getting [entity] statistics');

      const result = await this.get[Entity]StatsUseCase.execute();
      return result;
    } catch (error) {
      this.logger.error('Error getting [entity] statistics', { error });
      throw error;
    }
  }

  /**
   * Get [entity] by ID
   * @param id [Entity] ID
   * @returns [Entity] DTO
   */
  async get[Entity]ById(id: string): Promise<[Entity]DTO> {
    try {
      this.logger.info('Getting [entity] by ID', { id });

      const result = await this.get[Entity]ByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting [entity] by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new [entity]
   * @param params Creation parameters
   * @returns Created [entity] DTO
   */
  async create[Entity](params: Create[Entity]Params): Promise<[Entity]DTO> {
    try {
      // Redact sensitive information in logs
      const logParams = this.redactSensitiveData(params);
      this.logger.info('Creating [entity]', { params: logParams });

      const result = await this.create[Entity]UseCase.execute(params);
      return result;
    } catch (error) {
      const logParams = this.redactSensitiveData(params);
      this.logger.error('Error creating [entity]', { error, params: logParams });
      throw error;
    }
  }

  /**
   * Update an existing [entity]
   * @param params Update parameters
   * @returns Updated [entity] DTO
   */
  async update[Entity](params: Update[Entity]Params): Promise<[Entity]DTO> {
    try {
      // Redact sensitive information in logs
      const logParams = this.redactSensitiveData(params);
      this.logger.info('Updating [entity]', { params: logParams });

      const result = await this.update[Entity]UseCase.execute(params);
      return result;
    } catch (error) {
      const logParams = this.redactSensitiveData(params);
      this.logger.error('Error updating [entity]', { error, params: logParams });
      throw error;
    }
  }

  /**
   * Delete a [entity]
   * @param id [Entity] ID
   * @returns true if deleted successfully
   */
  async delete[Entity](id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting [entity]', { id });

      const result = await this.delete[Entity]UseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting [entity]', { error, id });
      throw error;
    }
  }

  /**
   * Redact sensitive data from parameters for logging
   * @param params Parameters to redact
   * @returns Redacted parameters
   */
  private redactSensitiveData(params: any): any {
    const redacted = { ...params };
    
    // Redact common sensitive fields
    if (redacted.email) redacted.email = '[REDACTED]';
    if (redacted.password) redacted.password = '[REDACTED]';
    if (redacted.phone) redacted.phone = '[REDACTED]';
    
    return redacted;
  }
}
```

### **3. Service Factory**
**Location**: Same file as service implementation

**Structure**:
```typescript
import { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[module]/backend/backend-[entity]-repository';
import { Get[Entity]sPaginatedUseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Get[Entity]sPaginatedUseCase';
import { Get[Entity]StatsUseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Get[Entity]StatsUseCase';
import { Get[Entity]ByIdUseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Get[Entity]ByIdUseCase';
import { Create[Entity]UseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Create[Entity]UseCase';
import { Update[Entity]UseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Update[Entity]UseCase';
import { Delete[Entity]UseCase } from '@/src/application/usecases/[module]/backend/[entity]s/Delete[Entity]UseCase';

/**
 * Factory class for creating [Entity]Backend[Entity]sService instances
 * Following Factory Pattern and Dependency Injection principles
 */
export class [Entity]Backend[Entity]sServiceFactory {
  /**
   * Create a new [Entity]Backend[Entity]sService instance
   * @param repository [Entity] repository implementation
   * @param logger Logger implementation
   * @returns [Entity]Backend[Entity]sService instance
   */
  static create(repository: [Entity]Backend[Entity]Repository, logger: Logger): [Entity]Backend[Entity]sService {
    // Create use case instances
    const get[Entity]sPaginatedUseCase = new Get[Entity]sPaginatedUseCase(repository);
    const get[Entity]StatsUseCase = new Get[Entity]StatsUseCase(repository);
    const get[Entity]ByIdUseCase = new Get[Entity]ByIdUseCase(repository);
    const create[Entity]UseCase = new Create[Entity]UseCase(repository);
    const update[Entity]UseCase = new Update[Entity]UseCase(repository);
    const delete[Entity]UseCase = new Delete[Entity]UseCase(repository);

    // Create and return service instance
    return new [Entity]Backend[Entity]sService(
      get[Entity]sPaginatedUseCase,
      get[Entity]StatsUseCase,
      get[Entity]ByIdUseCase,
      create[Entity]UseCase,
      update[Entity]UseCase,
      delete[Entity]UseCase,
      logger
    );
  }
}
```

### **4. DTOs Structure**
**Location**: `/src/application/dtos/[module]/backend/[entity]s-dto.ts`

**Structure**:
```typescript
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * [Entity] DTO for data transfer between layers
 */
export interface [Entity]DTO {
  id: string;
  // Define DTO properties (camelCase)
  createdAt: string;
  updatedAt: string;
}

/**
 * [Entity] statistics DTO
 */
export interface [Entity]StatsDTO {
  total[Entity]s: number;
  active[Entity]s: number;
  // Define other statistics properties
}

/**
 * Combined [entity]s data DTO
 */
export interface [Entity]sDataDTO {
  [entity]s: [Entity]DTO[];
  stats: [Entity]StatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Input DTO for Get[Entity]sPaginatedUseCase
 */
export interface Get[Entity]sPaginatedInput {
  page: number;
  limit: number;
}

/**
 * Paginated [entity]s result DTO
 */
export type Paginated[Entity]sDTO = PaginatedResult<[Entity]DTO>;
```

---

## **Key Principles**

### **Clean Architecture**
- **Separation of Concerns**: Service orchestrates use cases, doesn't contain business logic
- **Dependency Inversion**: Service depends on use case interfaces, not implementations
- **Single Responsibility**: Each service method has one clear purpose
- **Application Layer**: Services belong to application layer, coordinate domain operations

### **SOLID Principles**
- **Single Responsibility**: Each service method handles one operation
- **Open/Closed**: Easy to extend with new methods without modifying existing code
- **Liskov Substitution**: Service implementations are interchangeable via interface
- **Interface Segregation**: Service interface is focused and cohesive
- **Dependency Inversion**: Depends on abstractions (use case interfaces)

### **Service Patterns**
- **Factory Pattern**: ServiceFactory creates configured service instances
- **Dependency Injection**: All dependencies injected via constructor
- **Error Handling**: Consistent error logging and propagation
- **Logging**: Structured logging with context and sensitive data redaction
- **Parallel Operations**: Use Promise.all for independent operations

### **File Structure**
```
/src/application/
  ├── services/[module]/backend/
  │   └── Backend[Entity]sService.ts      # Service interface, implementation, and factory
  ├── dtos/[module]/backend/
  │   └── [entity]s-dto.ts                # Data Transfer Objects
  └── usecases/[module]/backend/[entity]s/
      ├── Get[Entity]sPaginatedUseCase.ts # Individual use cases
      ├── Get[Entity]StatsUseCase.ts
      ├── Get[Entity]ByIdUseCase.ts
      ├── Create[Entity]UseCase.ts
      ├── Update[Entity]UseCase.ts
      └── Delete[Entity]UseCase.ts
```

---

## **Example Usage**

To create a new "Employee" service:

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/services/shop/backend/BackendShopsService.ts

แล้วช่วยสร้าง service สำหรับ Employee ด้วยคับ

โดยที่ให้ทำตาม Clean Architecture และ SOLID principles

ตัวอย่าง DTOs /Users/marosdeeuma/shop-queue-nextjs/src/application/dtos/shop/backend/shops-dto.ts

ตัวอย่าง UseCase /Users/marosdeeuma/shop-queue-nextjs/src/application/usecases/shop/backend/shops/GetShopsPaginatedUseCase.ts
```

This will create:
- `BackendEmployeesService.ts` (service interface, implementation, and factory)
- `employees-dto.ts` (DTOs for data transfer)
- Individual use case files for each operation

---

## **Features Included**

✅ **Clean Architecture** - Proper separation between application and domain layers  
✅ **SOLID Principles** - Maintainable and testable service design  
✅ **Interface Segregation** - Focused service interface  
✅ **Dependency Injection** - Constructor injection for all dependencies  
✅ **Factory Pattern** - Centralized service creation with dependencies  
✅ **Error Handling** - Consistent error logging and propagation  
✅ **Structured Logging** - Contextual logging with sensitive data redaction  
✅ **Parallel Operations** - Efficient data fetching with Promise.all  
✅ **Type Safety** - Full TypeScript support with DTOs  
✅ **Use Case Orchestration** - Service coordinates multiple use cases  
✅ **Data Aggregation** - Combined data methods for complex operations  
✅ **Pagination Support** - Built-in pagination handling

---

## **Customization Points**

When using this template, customize:

1. **Entity Name** - Replace `[Entity]` and `[entity]` placeholders
2. **Module Name** - Replace `[module]` with appropriate module name
3. **DTO Properties** - Define entity-specific data transfer objects
4. **Service Methods** - Add domain-specific service operations
5. **Parameter Types** - Define create/update parameter structures
6. **Statistics** - Implement domain-specific statistics aggregation
7. **Logging Context** - Add relevant contextual information for logs
8. **Sensitive Data** - Configure appropriate data redaction rules
9. **Parallel Operations** - Identify operations that can run concurrently
10. **Validation** - Add service-level validation if needed

This template ensures consistency across all services while maintaining flexibility for specific domain requirements and following Clean Architecture principles.
