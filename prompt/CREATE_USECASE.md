# Create Use Case Template - Clean Architecture Pattern

## Prompt Template for Creating Use Cases

Use this prompt template to create use cases following Clean Architecture and SOLID principles, similar to the shop backend use cases implementation.

---

## **Base Prompt Structure**

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/usecases/shop/backend/shops/

แล้วช่วยสร้าง Use Cases ทั้งหมดสำหรับ [ENTITY_NAME] ด้วยคับ

โดยให้สร้าง Use Cases ดังนี้:
- Create[Entity]UseCase - สร้าง[entity_description]ใหม่
- Get[Entity]ByIdUseCase - ดึงข้อมูล[entity_description]ตาม ID
- Get[Entity]PaginatedUseCase - ดึงข้อมูล[entity_description]แบบ pagination
- Get[Entity]StatsUseCase - ดึงสถิติ[entity_description]
- Update[Entity]UseCase - อัปเดตข้อมูล[entity_description]
- Delete[Entity]UseCase - ลบ[entity_description]

ให้ใช้ Clean Architecture และ SOLID principles เหมือนตัวอย่าง
```

---

## **Implementation Patterns**

### **1. Create Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Create[Entity]UseCase.ts`

**Structure**:
```typescript
import { Create[Entity]InputDTO, [Entity]DTO } from '@/src/application/dtos/[domain]/backend/[entity]-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { [Entity]Mapper } from '@/src/application/mappers/[domain]/backend/[entity]-mapper';
import { Create[Entity]Entity, [Entity]Status } from '@/src/domain/entities/[domain]/backend/backend-[entity].entity';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

export class Create[Entity]UseCase implements IUseCase<Create[Entity]InputDTO, [Entity]DTO> {
  constructor(
    private readonly [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  async execute(params: Create[Entity]InputDTO): Promise<[Entity]DTO> {
    try {
      // Validate required fields
      if (!params.name?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          '[Entity] name is required',
          'Create[Entity]UseCase.execute',
          { params }
        );
      }

      // Add more validation as needed
      if (!params.requiredField?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          'Required field is required',
          'Create[Entity]UseCase.execute',
          { params }
        );
      }

      // Create entity
      const create[Entity]Entity: Omit<Create[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'> = {
        name: params.name.trim(),
        description: params.description?.trim() || '',
        // Map other fields from params
        status: [Entity]Status.ACTIVE, // or appropriate default status
        // Add other entity fields
      };

      const created[Entity] = await this.[entity]Repository.create[Entity](create[Entity]Entity);
      return [Entity]Mapper.toDTO(created[Entity]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to create [entity]',
        'Create[Entity]UseCase.execute',
        { params },
        error
      );
    }
  }
}
```

### **2. Get By ID Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Get[Entity]ByIdUseCase.ts`

**Structure**:
```typescript
import { [Entity]DTO } from '@/src/application/dtos/[domain]/backend/[entity]-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { [Entity]Mapper } from '@/src/application/mappers/[domain]/backend/[entity]-mapper';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

/**
 * Use case for getting [entity] by ID
 * Following SOLID principles and Clean Architecture
 */
export class Get[Entity]ByIdUseCase implements IUseCase<string, [Entity]DTO> {
  constructor(
    private readonly [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  /**
   * Execute the use case to get [entity] by ID
   * @param id [Entity] ID
   * @returns [Entity] data
   */
  async execute(id: string): Promise<[Entity]DTO> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          '[Entity] ID is required',
          'Get[Entity]ByIdUseCase.execute',
          { id }
        );
      }

      const [entity] = await this.[entity]Repository.get[Entity]ById(id);
      return [Entity]Mapper.toDTO([entity]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to get [entity] by ID',
        'Get[Entity]ByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
```

### **3. Get Paginated Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Get[Entity]PaginatedUseCase.ts`

**Structure**:
```typescript
import { Get[Entity]PaginatedInput, Paginated[Entity]DTO } from '@/src/application/dtos/[domain]/backend/[entity]-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { [Entity]Mapper } from '@/src/application/mappers/[domain]/backend/[entity]-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

/**
 * Use case for getting paginated [entity] data
 * Following SOLID principles and Clean Architecture
 */
export class Get[Entity]PaginatedUseCase implements IUseCase<Get[Entity]PaginatedInput, Paginated[Entity]DTO> {
  constructor(
    private [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  /**
   * Execute the use case to get paginated [entity] data
   * @param input Pagination parameters
   * @returns Paginated [entity] data
   */
  async execute(input: Get[Entity]PaginatedInput): Promise<Paginated[Entity]DTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginated[Entity] = await this.[entity]Repository.getPaginated[Entity](paginationParams);
      return [Entity]Mapper.toPaginatedDTO(paginated[Entity]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to get paginated [entity]',
        'Get[Entity]PaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
```

### **4. Get Stats Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Get[Entity]StatsUseCase.ts`

**Structure**:
```typescript
import { [Entity]StatsDTO } from '@/src/application/dtos/[domain]/backend/[entity]-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { [Entity]Mapper } from '@/src/application/mappers/[domain]/backend/[entity]-mapper';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

/**
 * Use case for getting [entity] statistics
 * Following SOLID principles and Clean Architecture
 */
export class Get[Entity]StatsUseCase implements IUseCase<void, [Entity]StatsDTO> {
  constructor(
    private readonly [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  /**
   * Execute the use case to get [entity] statistics
   * @returns [Entity] statistics
   */
  async execute(): Promise<[Entity]StatsDTO> {
    try {
      const stats = await this.[entity]Repository.get[Entity]Stats();
      return [Entity]Mapper.toStatsDTO(stats);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to get [entity] statistics',
        'Get[Entity]StatsUseCase.execute',
        {},
        error
      );
    }
  }
}
```

### **5. Update Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Update[Entity]UseCase.ts`

**Structure**:
```typescript
import { Update[Entity]InputDTO, [Entity]DTO } from '@/src/application/dtos/[domain]/backend/[entity]-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { [Entity]Mapper } from '@/src/application/mappers/[domain]/backend/[entity]-mapper';
import { Update[Entity]Entity } from '@/src/domain/entities/[domain]/backend/backend-[entity].entity';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

export class Update[Entity]UseCase implements IUseCase<Update[Entity]InputDTO, [Entity]DTO> {
  constructor(
    private readonly [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  async execute(params: Update[Entity]InputDTO): Promise<[Entity]DTO> {
    try {
      // Validate required fields
      if (!params.id?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          '[Entity] ID is required',
          'Update[Entity]UseCase.execute',
          { params }
        );
      }

      if (!params.name?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          '[Entity] name is required',
          'Update[Entity]UseCase.execute',
          { params }
        );
      }

      // Check if [entity] exists
      const existing[Entity] = await this.[entity]Repository.get[Entity]ById(params.id);
      if (!existing[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.NOT_FOUND,
          '[Entity] not found',
          'Update[Entity]UseCase.execute',
          { params }
        );
      }

      // Create update entity
      const update[Entity]Entity: Update[Entity]Entity = {
        id: params.id,
        name: params.name.trim(),
        description: params.description?.trim() || '',
        // Map other fields from params
        updatedAt: new Date()
      };

      const updated[Entity] = await this.[entity]Repository.update[Entity](update[Entity]Entity);
      return [Entity]Mapper.toDTO(updated[Entity]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to update [entity]',
        'Update[Entity]UseCase.execute',
        { params },
        error
      );
    }
  }
}
```

### **6. Delete Use Case**
**Location**: `/src/application/usecases/[domain]/backend/[entity]/Delete[Entity]UseCase.ts`

**Structure**:
```typescript
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

/**
 * Use case for deleting [entity]
 * Following SOLID principles and Clean Architecture
 */
export class Delete[Entity]UseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly [entity]Repository: [Entity]Backend[Entity]Repository
  ) { }

  /**
   * Execute the use case to delete [entity]
   * @param id [Entity] ID to delete
   * @returns Success status
   */
  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.VALIDATION_ERROR,
          '[Entity] ID is required',
          'Delete[Entity]UseCase.execute',
          { id }
        );
      }

      // Check if [entity] exists
      const existing[Entity] = await this.[entity]Repository.get[Entity]ById(id);
      if (!existing[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.NOT_FOUND,
          '[Entity] not found',
          'Delete[Entity]UseCase.execute',
          { id }
        );
      }

      const result = await this.[entity]Repository.delete[Entity](id);
      return result;
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'Failed to delete [entity]',
        'Delete[Entity]UseCase.execute',
        { id },
        error
      );
    }
  }
}
```

---

## **Required Dependencies**

### **1. DTOs** (must exist first)
**Location**: `/src/application/dtos/[domain]/backend/[entity]-dto.ts`

Required DTOs:
```typescript
export interface [Entity]DTO {
  id: string;
  name: string;
  description: string;
  // Other entity fields
  createdAt: string;
  updatedAt: string;
}

export interface [Entity]StatsDTO {
  total: number;
  active: number;
  inactive: number;
  // Other stats fields
}

export interface Create[Entity]InputDTO {
  name: string;
  description?: string;
  // Other creation fields
}

export interface Update[Entity]InputDTO {
  id: string;
  name: string;
  description?: string;
  // Other update fields
}

export interface Get[Entity]PaginatedInput {
  page?: number;
  limit?: number;
}

export interface Paginated[Entity]DTO {
  data: [Entity]DTO[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### **2. Domain Entities**
**Location**: `/src/domain/entities/[domain]/backend/backend-[entity].entity.ts`

Required entities:
```typescript
export interface [Entity]Entity {
  id: string;
  name: string;
  description: string;
  // Other entity fields
  createdAt: Date;
  updatedAt: Date;
}

export interface Create[Entity]Entity extends Omit<[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'> {}

export interface Update[Entity]Entity extends Partial<[Entity]Entity> {
  id: string;
  updatedAt: Date;
}

export interface [Entity]StatsEntity {
  total: number;
  active: number;
  inactive: number;
  // Other stats fields
}

export enum [Entity]Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft'
}
```

### **3. Repository Interface**
**Location**: `/src/domain/repositories/[domain]/backend/backend-[entity]-repository.ts`

Required repository methods:
```typescript
export interface [Entity]Backend[Entity]Repository {
  getPaginated[Entity](params: PaginationParams): Promise<PaginatedResult<[Entity]Entity>>;
  get[Entity]Stats(): Promise<[Entity]StatsEntity>;
  get[Entity]ById(id: string): Promise<[Entity]Entity>;
  create[Entity](entity: Create[Entity]Entity): Promise<[Entity]Entity>;
  update[Entity](entity: Update[Entity]Entity): Promise<[Entity]Entity>;
  delete[Entity](id: string): Promise<boolean>;
}
```

### **4. Mapper**
**Location**: `/src/application/mappers/[domain]/backend/[entity]-mapper.ts`

Required mapper methods:
```typescript
export class [Entity]Mapper {
  static toDTO(entity: [Entity]Entity): [Entity]DTO;
  static toStatsDTO(stats: [Entity]StatsEntity): [Entity]StatsDTO;
  static toPaginatedDTO(paginated: PaginatedResult<[Entity]Entity>): Paginated[Entity]DTO;
}
```

---

## **Key Principles**

### **Clean Architecture**
- **Single Responsibility**: Each use case has one specific business operation
- **Dependency Inversion**: Depends on repository interface, not implementation
- **Input/Output Isolation**: Clear DTOs for input and output
- **Error Handling**: Domain-specific error types and consistent error handling

### **SOLID Principles**
- **Single Responsibility**: One use case = one business operation
- **Open/Closed**: Extensible through new use cases, closed for modification
- **Liskov Substitution**: Repository interface can be replaced
- **Interface Segregation**: IUseCase interface is focused and minimal
- **Dependency Inversion**: Depends on abstractions (interfaces)

### **Use Case Structure**
```
Use Case
├── Input DTO (typed parameters)
├── Output DTO (typed response)
├── Validation (input validation)
├── Business Logic (domain operations)
├── Repository Calls (data persistence)
├── Error Handling (domain-specific errors)
└── Response Mapping (entity to DTO)
```

---

## **Example Usage**

To create all use cases for "Customer" entity:

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/usecases/shop/backend/shops/

แล้วช่วยสร้าง Use Cases ทั้งหมดสำหรับ Customer ด้วยคับ

โดยให้สร้าง Use Cases ดังนี้:
- CreateCustomerUseCase - สร้างลูกค้าใหม่
- GetCustomerByIdUseCase - ดึงข้อมูลลูกค้าตาม ID
- GetCustomerPaginatedUseCase - ดึงข้อมูลลูกค้าแบบ pagination
- GetCustomerStatsUseCase - ดึงสถิติลูกค้า
- UpdateCustomerUseCase - อัปเดตข้อมูลลูกค้า
- DeleteCustomerUseCase - ลบลูกค้า

ให้ใช้ Clean Architecture และ SOLID principles เหมือนตัวอย่าง
```

This will create all 6 use cases with:
- Proper input/output DTOs
- Comprehensive validation
- Domain-specific error handling
- Repository interface dependencies
- Clean Architecture compliance
- SOLID principles implementation

---

## **Features Included**

✅ **Clean Architecture** - Proper separation of concerns and dependency flow  
✅ **SOLID Principles** - All five principles implemented in each use case  
✅ **Input Validation** - Comprehensive parameter validation  
✅ **Error Handling** - Domain-specific error types and consistent handling  
✅ **Type Safety** - Full TypeScript support with proper DTOs  
✅ **Repository Pattern** - Clean dependency on repository interface  
✅ **Single Responsibility** - Each use case handles one business operation  
✅ **Testability** - Easy to unit test with mocked dependencies  
✅ **Consistency** - Uniform structure across all use cases  
✅ **Documentation** - Clear JSDoc comments for each use case  
✅ **Business Logic Isolation** - Pure business logic without infrastructure concerns

---

## **Customization Points**

When using this template, customize:

1. **Entity Name** - Replace `[Entity]` and `[entity]` placeholders
2. **Domain Context** - Replace `[domain]` with appropriate domain
3. **Validation Rules** - Add entity-specific validation logic
4. **Business Rules** - Implement domain-specific business logic
5. **Error Types** - Define appropriate error types for the domain
6. **Field Mapping** - Map specific entity fields in create/update operations
7. **Status Enums** - Define appropriate status values for the entity
8. **Relationships** - Handle entity relationships and foreign keys
9. **Security Rules** - Add authorization and access control logic
10. **Performance** - Optimize database queries and operations

This template ensures consistency across all use cases while maintaining flexibility for domain-specific requirements and following Clean Architecture principles.
