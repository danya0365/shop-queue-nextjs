# Create Service Template - Clean Architecture Pattern

## Prompt Template for Creating Backend Services

Use this prompt template to create backend services following Clean Architecture and SOLID principles, similar to the BackendShopsService implementation.

---

## **Base Prompt Structure**

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/services/shop/backend/BackendShopsService.ts

แล้วช่วยสร้าง Backend[ENTITY_NAME]Service สำหรับจัดการ [entity_description] ด้วยคับ

โดยให้มี methods ดังนี้:
- get[Entity]Data() - ดึงข้อมูลพร้อม pagination และ statistics
- get[Entity]Paginated() - ดึงข้อมูลแบบ pagination
- get[Entity]Stats() - ดึงสถิติ
- get[Entity]ById() - ดึงข้อมูลตาม ID
- create[Entity]() - สร้างข้อมูลใหม่
- update[Entity]() - อัปเดตข้อมูล
- delete[Entity]() - ลบข้อมูล

ให้ใช้ Clean Architecture และ SOLID principles เหมือนตัวอย่าง
```

---

## **Implementation Pattern**

### **1. Service Interface**
**Location**: `/src/application/services/[domain]/backend/Backend[Entity]Service.ts`

**Structure**:
```typescript
import type { 
  Create[Entity]InputDTO, 
  Get[Entity]PaginatedInput, 
  Paginated[Entity]DTO, 
  [Entity]DTO, 
  [Entity]StatsDTO, 
  [Entity]DataDTO, 
  Update[Entity]InputDTO 
} from '@/src/application/dtos/[domain]/backend/[entity]-dto';

export interface I[Entity]Backend[Entity]Service {
  get[Entity]Data(page?: number, perPage?: number): Promise<[Entity]DataDTO>;
  get[Entity]Paginated(page?: number, perPage?: number): Promise<Paginated[Entity]DTO>;
  get[Entity]Stats(): Promise<[Entity]StatsDTO>;
  get[Entity]ById(id: string): Promise<[Entity]DTO>;
  create[Entity](params: Create[Entity]InputDTO): Promise<[Entity]DTO>;
  update[Entity](params: Update[Entity]InputDTO): Promise<[Entity]DTO>;
  delete[Entity](id: string): Promise<boolean>;
}
```

### **2. Service Implementation**
```typescript
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { Create[Entity]UseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Create[Entity]UseCase';
import { Delete[Entity]UseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Delete[Entity]UseCase';
import { Get[Entity]ByIdUseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Get[Entity]ByIdUseCase';
import { Get[Entity]PaginatedUseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Get[Entity]PaginatedUseCase';
import { Get[Entity]StatsUseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Get[Entity]StatsUseCase';
import { Update[Entity]UseCase } from '@/src/application/usecases/[domain]/backend/[entity]/Update[Entity]UseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { [Entity]Backend[Entity]Repository } from '@/src/domain/repositories/[domain]/backend/backend-[entity]-repository';

export class [Entity]Backend[Entity]Service implements I[Entity]Backend[Entity]Service {
  constructor(
    private readonly get[Entity]PaginatedUseCase: IUseCase<Get[Entity]PaginatedInput, Paginated[Entity]DTO>,
    private readonly get[Entity]StatsUseCase: IUseCase<void, [Entity]StatsDTO>,
    private readonly get[Entity]ByIdUseCase: IUseCase<string, [Entity]DTO>,
    private readonly create[Entity]UseCase: IUseCase<Create[Entity]InputDTO, [Entity]DTO>,
    private readonly update[Entity]UseCase: IUseCase<Update[Entity]InputDTO, [Entity]DTO>,
    private readonly delete[Entity]UseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get [entity] data including paginated [entity] and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns [Entity] data DTO
   */
  async get[Entity]Data(page: number = 1, perPage: number = 10): Promise<[Entity]DataDTO> {
    try {
      this.logger.info('Getting [entity] data', { page, perPage });

      // Get [entity] and stats in parallel
      const [[entity]Result, stats] = await Promise.all([
        this.get[Entity]PaginatedUseCase.execute({ page, limit: perPage }),
        this.get[Entity]StatsUseCase.execute()
      ]);

      return {
        [entity]: [entity]Result.data,
        stats,
        totalCount: [entity]Result.pagination.totalItems,
        currentPage: [entity]Result.pagination.currentPage,
        perPage: [entity]Result.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting [entity] data', { error, page, perPage });
      throw error;
    }
  }

  async get[Entity]Paginated(page: number = 1, perPage: number = 10): Promise<Paginated[Entity]DTO> {
    try {
      this.logger.info('Getting paginated [entity] data', { page, perPage });

      const result = await this.get[Entity]PaginatedUseCase.execute({ page, limit: perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated [entity] data', { error, page, perPage });
      throw error;
    }
  }

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

  async create[Entity](params: Create[Entity]InputDTO): Promise<[Entity]DTO> {
    try {
      this.logger.info('Creating [entity]', { 
        params: { 
          ...params, 
          // Redact sensitive fields if any
          email: params.email ? '[REDACTED]' : undefined 
        } 
      });

      const result = await this.create[Entity]UseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating [entity]', { 
        error, 
        params: { 
          ...params, 
          email: params.email ? '[REDACTED]' : undefined 
        } 
      });
      throw error;
    }
  }

  async update[Entity](params: Update[Entity]InputDTO): Promise<[Entity]DTO> {
    try {
      this.logger.info('Updating [entity]', { 
        params: { 
          ...params, 
          email: params.email ? '[REDACTED]' : undefined 
        } 
      });

      const result = await this.update[Entity]UseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error updating [entity]', { 
        error, 
        params: { 
          ...params, 
          email: params.email ? '[REDACTED]' : undefined 
        } 
      });
      throw error;
    }
  }

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
}
```

### **3. Service Factory**
```typescript
export class [Entity]Backend[Entity]ServiceFactory {
  static create(repository: [Entity]Backend[Entity]Repository, logger: Logger): [Entity]Backend[Entity]Service {
    const get[Entity]PaginatedUseCase = new Get[Entity]PaginatedUseCase(repository);
    const get[Entity]StatsUseCase = new Get[Entity]StatsUseCase(repository);
    const get[Entity]ByIdUseCase = new Get[Entity]ByIdUseCase(repository);
    const create[Entity]UseCase = new Create[Entity]UseCase(repository);
    const update[Entity]UseCase = new Update[Entity]UseCase(repository);
    const delete[Entity]UseCase = new Delete[Entity]UseCase(repository);
    
    return new [Entity]Backend[Entity]Service(
      get[Entity]PaginatedUseCase, 
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

---

## **Required Dependencies**

### **1. DTOs** (must exist first)
**Location**: `/src/application/dtos/[domain]/backend/[entity]-dto.ts`

Required DTOs:
- `[Entity]DTO` - Main entity data transfer object
- `[Entity]StatsDTO` - Statistics data transfer object
- `[Entity]DataDTO` - Combined data with pagination and stats
- `Paginated[Entity]DTO` - Paginated entity data
- `Create[Entity]InputDTO` - Input for creating entity
- `Update[Entity]InputDTO` - Input for updating entity
- `Get[Entity]PaginatedInput` - Input for pagination

### **2. Use Cases** (must exist first)
**Location**: `/src/application/usecases/[domain]/backend/[entity]/`

Required Use Cases:
- `Create[Entity]UseCase.ts`
- `Delete[Entity]UseCase.ts`
- `Get[Entity]ByIdUseCase.ts`
- `Get[Entity]PaginatedUseCase.ts`
- `Get[Entity]StatsUseCase.ts`
- `Update[Entity]UseCase.ts`

### **3. Repository Interface**
**Location**: `/src/domain/repositories/[domain]/backend/backend-[entity]-repository.ts`

Required repository interface with methods:
- `getPaginated[Entity](params: PaginationParams): Promise<PaginatedResult<[Entity]Entity>>`
- `get[Entity]Stats(): Promise<[Entity]StatsEntity>`
- `get[Entity]ById(id: string): Promise<[Entity]Entity>`
- `create[Entity](entity: Create[Entity]Entity): Promise<[Entity]Entity>`
- `update[Entity](entity: Update[Entity]Entity): Promise<[Entity]Entity>`
- `delete[Entity](id: string): Promise<boolean>`

---

## **Key Principles**

### **Clean Architecture**
- **Separation of Concerns**: Service orchestrates use cases, doesn't contain business logic
- **Dependency Inversion**: Depends on abstractions (interfaces), not concretions
- **Single Responsibility**: Each method has one clear purpose
- **Error Handling**: Consistent error logging and propagation

### **SOLID Principles**
- **Single Responsibility**: Service only orchestrates use cases
- **Open/Closed**: Extensible through new use cases
- **Liskov Substitution**: Interface can be replaced with any implementation
- **Interface Segregation**: Clean interface with focused methods
- **Dependency Inversion**: Depends on IUseCase interface, not concrete classes

### **Service Structure**
```
Backend[Entity]Service
├── Interface (I[Entity]Backend[Entity]Service)
├── Implementation ([Entity]Backend[Entity]Service)
├── Factory ([Entity]Backend[Entity]ServiceFactory)
└── Dependencies
    ├── Use Cases (via IUseCase interface)
    ├── Logger (for observability)
    └── Repository (via factory, not direct dependency)
```

---

## **Example Usage**

To create a new "Customer" backend service:

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/application/services/shop/backend/BackendShopsService.ts

แล้วช่วยสร้าง BackendCustomerService สำหรับจัดการลูกค้าในระบบ ด้วยคับ

โดยให้มี methods ดังนี้:
- getCustomerData() - ดึงข้อมูลลูกค้าพร้อม pagination และ statistics
- getCustomerPaginated() - ดึงข้อมูลลูกค้าแบบ pagination
- getCustomerStats() - ดึงสถิติลูกค้า
- getCustomerById() - ดึงข้อมูลลูกค้าตาม ID
- createCustomer() - สร้างลูกค้าใหม่
- updateCustomer() - อัปเดตข้อมูลลูกค้า
- deleteCustomer() - ลบลูกค้า

ให้ใช้ Clean Architecture และ SOLID principles เหมือนตัวอย่าง
```

This will create:
- `ICustomerBackendCustomerService` interface
- `CustomerBackendCustomerService` implementation
- `CustomerBackendCustomerServiceFactory` factory class
- All required CRUD and pagination methods
- Proper error handling and logging
- Clean Architecture compliance

---

## **Features Included**

✅ **Clean Architecture** - Proper separation of concerns and dependency flow  
✅ **SOLID Principles** - All five principles implemented  
✅ **Error Handling** - Comprehensive error logging and propagation  
✅ **Type Safety** - Full TypeScript support with proper interfaces  
✅ **Dependency Injection** - Constructor injection with factory pattern  
✅ **Use Case Orchestration** - Service coordinates multiple use cases  
✅ **Parallel Processing** - Efficient data fetching with Promise.all  
✅ **Logging** - Structured logging for observability  
✅ **Data Security** - Sensitive data redaction in logs  
✅ **Pagination Support** - Built-in pagination handling  
✅ **Statistics Integration** - Combined data and stats retrieval

---

## **Customization Points**

When using this template, customize:

1. **Entity Name** - Replace `[Entity]` and `[entity]` placeholders
2. **Domain Context** - Replace `[domain]` with appropriate domain
3. **DTOs** - Define appropriate data transfer objects
4. **Validation Rules** - Add entity-specific validation in use cases
5. **Business Logic** - Implement domain-specific rules in use cases
6. **Error Handling** - Add entity-specific error types and messages
7. **Logging Context** - Add relevant contextual information for logs
8. **Security** - Identify and redact sensitive fields in logs
9. **Performance** - Optimize parallel processing for specific use cases
10. **Repository Methods** - Ensure repository interface matches service needs

This template ensures consistency across all backend services while maintaining flexibility for domain-specific requirements and following Clean Architecture principles.
