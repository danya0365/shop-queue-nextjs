# Create Repository Template - Clean Architecture Pattern

## Prompt Template for Creating New Repositories

Use this prompt template to create new repositories following Clean Architecture and SOLID principles, similar to the shop backend repository implementation.

---

## **Base Prompt Structure**

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/repositories/shop/backend/supabase-backend-shop-repository.ts

แล้วช่วยสร้าง repository สำหรับ [ENTITY_NAME] ด้วยคับ

โดยที่ให้ทำตาม Clean Architecture และ SOLID principles

ตัวอย่าง entity /Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/shop/backend/backend-shop.entity.ts

ตัวอย่าง repository interface /Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/shop/backend/backend-shop-repository.ts

ตัวอย่าง mapper /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/shop/backend/supabase-backend-shop.mapper.ts

ตัวอย่าง schema /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/shop/backend/shop.schema.ts
```

---

## **Implementation Pattern**

### **1. Domain Entity**
**Location**: `/src/domain/entities/[module]/backend/backend-[entity].entity.ts`

**Structure**:
```typescript
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * [Entity] entity representing [description] in the system
 * Following Clean Architecture principles - domain entity
 */
export interface [Entity]Entity {
  id: string;
  // Define entity properties
  createdAt: string;
  updatedAt: string;
}

export interface Create[Entity]Entity {
  // Define creation properties (exclude id, createdAt, updatedAt)
}

export interface Update[Entity]Entity {
  // Define update properties (all optional except required fields)
}

/**
 * [Entity] statistics entity
 */
export interface [Entity]StatsEntity {
  // Define statistics properties
}

/**
 * Paginated [entity] result
 */
export type Paginated[Entity]sEntity = PaginatedResult<[Entity]Entity>;
```

### **2. Repository Interface**
**Location**: `/src/domain/repositories/[module]/backend/backend-[entity]-repository.ts`

**Structure**:
```typescript
import type { Create[Entity]Entity, Paginated[Entity]sEntity, [Entity]Entity, [Entity]StatsEntity, Update[Entity]Entity } from '@/src/domain/entities/[module]/backend/backend-[entity].entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * [Entity] repository error types
 */
export enum [Entity]Backend[Entity]ErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for [entity] repository operations
 * Following Clean Architecture principles for error handling
 */
export class [Entity]Backend[Entity]Error extends Error {
  constructor(
    public readonly type: [Entity]Backend[Entity]ErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = '[Entity]Backend[Entity]Error';
  }
}

/**
 * [Entity] repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface [Entity]Backend[Entity]Repository {
  /**
   * Get paginated [entity] data
   * @param params Pagination parameters
   * @returns Paginated [entity] data
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  getPaginated[Entity]s(params: PaginationParams): Promise<Paginated[Entity]sEntity>;

  /**
   * Get [entity] statistics
   * @returns [Entity] statistics data
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  get[Entity]Stats(): Promise<[Entity]StatsEntity>;

  /**
   * Get [entity] by ID
   * @param id [Entity] ID
   * @returns [Entity] entity or null if not found
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  get[Entity]ById(id: string): Promise<[Entity]Entity | null>;

  /**
   * Create a new [entity]
   * @param [entity] [Entity] data to create
   * @returns Created [entity] entity
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  create[Entity]([entity]: Omit<Create[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'>): Promise<[Entity]Entity>;

  /**
   * Update an existing [entity]
   * @param id [Entity] ID
   * @param [entity] [Entity] data to update
   * @returns Updated [entity] entity
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  update[Entity](id: string, [entity]: Partial<Omit<Update[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<[Entity]Entity>;

  /**
   * Delete a [entity]
   * @param id [Entity] ID
   * @returns true if deleted successfully
   * @throws [Entity]Backend[Entity]Error if the operation fails
   */
  delete[Entity](id: string): Promise<boolean>;
}
```

### **3. Database Schema**
**Location**: `/src/infrastructure/schemas/[module]/backend/[entity].schema.ts`

**Structure**:
```typescript
/**
 * Database schema types for [entity]
 * These types match the actual database structure
 */

/**
 * [Entity] database schema
 */
export interface [Entity]Schema {
  id: string;
  // Define database fields (snake_case)
  created_at: string;
  updated_at: string;
  // Joined data from related tables
  related_field?: RelatedSchema[];
}

/**
 * [Entity] stats database schema
 */
export interface [Entity]StatsSchema {
  // Define statistics fields (snake_case)
}
```

### **4. Mapper Class**
**Location**: `/src/infrastructure/mappers/[module]/backend/supabase-backend-[entity].mapper.ts`

**Structure**:
```typescript
import { [Entity]Entity, [Entity]StatsEntity } from "@/src/domain/entities/[module]/backend/backend-[entity].entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { [Entity]Schema, [Entity]StatsSchema } from "@/src/infrastructure/schemas/[module]/backend/[entity].schema";

/**
 * Mapper class for converting between [entity] database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class Supabase[Entity]Backend[Entity]Mapper {
  /**
   * Map database schema to domain entity
   * @param schema [Entity] database schema
   * @returns [Entity] domain entity
   */
  public static toDomain(schema: [Entity]Schema): [Entity]Entity {
    return {
      id: schema.id,
      // Map snake_case to camelCase
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
      // Handle joined data and transformations
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity [Entity] domain entity
   * @returns [Entity] database schema
   */
  public static toSchema(entity: [Entity]Entity): [Entity]Schema {
    return {
      id: entity.id,
      // Map camelCase to snake_case
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map [entity] stats schema to domain entity
   * @param schema [Entity] stats database schema
   * @returns [Entity] stats domain entity
   */
  public static statsToEntity(schema: [Entity]StatsSchema): [Entity]StatsEntity {
    return {
      // Map statistics fields
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
```

### **5. Repository Implementation**
**Location**: `/src/infrastructure/repositories/[module]/backend/supabase-backend-[entity]-repository.ts`

**Structure**:
```typescript
import { Create[Entity]Entity, Paginated[Entity]sEntity, [Entity]Entity, [Entity]StatsEntity, Update[Entity]Entity } from "@/src/domain/entities/[module]/backend/backend-[entity].entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { [Entity]Backend[Entity]Error, [Entity]Backend[Entity]ErrorType, [Entity]Backend[Entity]Repository } from "@/src/domain/repositories/[module]/backend/backend-[entity]-repository";
import { Supabase[Entity]Backend[Entity]Mapper } from "@/src/infrastructure/mappers/[module]/backend/supabase-backend-[entity].mapper";
import { [Entity]Schema, [Entity]StatsSchema } from "@/src/infrastructure/schemas/[module]/backend/[entity].schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type [Entity]SchemaRecord = Record<string, unknown> & [Entity]Schema;
type [Entity]StatsSchemaRecord = Record<string, unknown> & [Entity]StatsSchema;

/**
 * Supabase implementation of the [entity] repository
 * Following Clean Architecture principles for repository implementation
 */
export class Supabase[Entity]Backend[Entity]Repository extends StandardRepository implements [Entity]Backend[Entity]Repository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "[Entity]Backend[Entity]");
  }

  /**
   * Get paginated [entity] data from database
   * @param params Pagination parameters
   * @returns Paginated [entity] data
   */
  async getPaginated[Entity]s(params: PaginationParams): Promise<Paginated[Entity]sEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      const queryOptions: QueryOptions = {
        select: ['*'],
        joins: [
          // Define joins if needed
        ],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      const [entity]s = await this.dataSource.getAdvanced<[Entity]SchemaRecord>(
        '[entity]s',
        queryOptions
      );

      const totalItems = await this.dataSource.count('[entity]s', queryOptions);

      // Map database results to domain entities
      const mapped[Entity]s = [entity]s.map([entity] => 
        Supabase[Entity]Backend[Entity]Mapper.toDomain([entity])
      );

      // Create pagination metadata
      const pagination = Supabase[Entity]Backend[Entity]Mapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mapped[Entity]s,
        pagination
      };
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in getPaginated[Entity]s', { error });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while fetching [entity]s',
        'getPaginated[Entity]s',
        {},
        error
      );
    }
  }

  /**
   * Get [entity] statistics from database
   * @returns [Entity] statistics
   */
  async get[Entity]Stats(): Promise<[Entity]StatsEntity> {
    try {
      const queryOptions: QueryOptions = {
        select: ['*'],
      };

      const statsData = await this.dataSource.getAdvanced<[Entity]StatsSchemaRecord>(
        '[entity]_stats_summary_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // Return default values if no stats found
        return {
          // Define default statistics
        };
      }

      return Supabase[Entity]Backend[Entity]Mapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in get[Entity]Stats', { error });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while fetching [entity] statistics',
        'get[Entity]Stats',
        {},
        error
      );
    }
  }

  /**
   * Get [entity] by ID
   * @param id [Entity] ID
   * @returns [Entity] entity or null if not found
   */
  async get[Entity]ById(id: string): Promise<[Entity]Entity | null> {
    try {
      const [entity] = await this.dataSource.getById<[Entity]SchemaRecord>(
        '[entity]s',
        id,
        {
          select: ['*'],
          joins: [
            // Define joins if needed
          ]
        }
      );

      if (![entity]) {
        return null;
      }

      return Supabase[Entity]Backend[Entity]Mapper.toDomain([entity]);
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in get[Entity]ById', { error, id });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while fetching [entity]',
        'get[Entity]ById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new [entity]
   * @param [entity] [Entity] data to create
   * @returns Created [entity] entity
   */
  async create[Entity]([entity]: Omit<Create[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'>): Promise<[Entity]Entity> {
    try {
      // Convert domain entity to database schema
      const [entity]Schema = {
        // Map entity properties to database fields
      };

      const created[Entity] = await this.dataSource.insert<[Entity]SchemaRecord>(
        '[entity]s',
        [entity]Schema
      );

      if (!created[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.OPERATION_FAILED,
          'Failed to create [entity]',
          'create[Entity]',
          { [entity] }
        );
      }

      return this.get[Entity]ById(created[Entity].id) as Promise<[Entity]Entity>;
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in create[Entity]', { error, [entity] });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while creating [entity]',
        'create[Entity]',
        { [entity] },
        error
      );
    }
  }

  /**
   * Update an existing [entity]
   * @param id [Entity] ID
   * @param [entity] [Entity] data to update
   * @returns Updated [entity] entity
   */
  async update[Entity](id: string, [entity]: Partial<Omit<Update[Entity]Entity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<[Entity]Entity> {
    try {
      // Check if [entity] exists
      const existing[Entity] = await this.get[Entity]ById(id);
      if (!existing[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.NOT_FOUND,
          `[Entity] with ID ${id} not found`,
          'update[Entity]',
          { id, [entity] }
        );
      }

      // Convert domain entity to database schema
      const [entity]Schema: Partial<[Entity]Schema> = {
        // Map updated properties to database fields
      };

      const updated[Entity] = await this.dataSource.update<[Entity]SchemaRecord>(
        '[entity]s',
        id,
        [entity]Schema
      );

      if (!updated[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.OPERATION_FAILED,
          'Failed to update [entity]',
          'update[Entity]',
          { id, [entity] }
        );
      }

      return this.get[Entity]ById(id) as Promise<[Entity]Entity>;
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in update[Entity]', { error, id, [entity] });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while updating [entity]',
        'update[Entity]',
        { id, [entity] },
        error
      );
    }
  }

  /**
   * Delete a [entity]
   * @param id [Entity] ID
   * @returns true if deleted successfully
   */
  async delete[Entity](id: string): Promise<boolean> {
    try {
      // Check if [entity] exists
      const existing[Entity] = await this.get[Entity]ById(id);
      if (!existing[Entity]) {
        throw new [Entity]Backend[Entity]Error(
          [Entity]Backend[Entity]ErrorType.NOT_FOUND,
          `[Entity] with ID ${id} not found`,
          'delete[Entity]',
          { id }
        );
      }

      await this.dataSource.delete('[entity]s', id);
      return true;
    } catch (error) {
      if (error instanceof [Entity]Backend[Entity]Error) {
        throw error;
      }

      this.logger.error('Error in delete[Entity]', { error, id });
      throw new [Entity]Backend[Entity]Error(
        [Entity]Backend[Entity]ErrorType.UNKNOWN,
        'An unexpected error occurred while deleting [entity]',
        'delete[Entity]',
        { id },
        error
      );
    }
  }
}
```

---

## **Key Principles**

### **Clean Architecture**
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Repository depends on abstractions (interfaces)
- **Domain Independence**: Domain entities are pure business objects
- **Infrastructure Isolation**: Database-specific code is isolated in infrastructure layer

### **SOLID Principles**
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Repository implementations are interchangeable
- **Interface Segregation**: Repository interface is focused and cohesive
- **Dependency Inversion**: Depend on abstractions, not concretions

### **File Structure**
```
/src/domain/
  ├── entities/[module]/backend/
  │   └── backend-[entity].entity.ts     # Domain entities
  └── repositories/[module]/backend/
      └── backend-[entity]-repository.ts # Repository interface

/src/infrastructure/
  ├── schemas/[module]/backend/
  │   └── [entity].schema.ts             # Database schemas
  ├── mappers/[module]/backend/
  │   └── supabase-backend-[entity].mapper.ts # Data mappers
  └── repositories/[module]/backend/
      └── supabase-backend-[entity]-repository.ts # Repository implementation
```

---

## **Example Usage**

To create a new "Employee" repository:

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/repositories/shop/backend/supabase-backend-shop-repository.ts

แล้วช่วยสร้าง repository สำหรับ Employee ด้วยคับ

โดยที่ให้ทำตาม Clean Architecture และ SOLID principles

ตัวอย่าง entity /Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/shop/backend/backend-shop.entity.ts

ตัวอย่าง repository interface /Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/shop/backend/backend-shop-repository.ts

ตัวอย่าง mapper /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/shop/backend/supabase-backend-shop.mapper.ts

ตัวอย่าง schema /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/shop/backend/shop.schema.ts
```

This will create:
- `backend-employee.entity.ts` (domain entities)
- `backend-employee-repository.ts` (repository interface)
- `employee.schema.ts` (database schemas)
- `supabase-backend-employee.mapper.ts` (data mapper)
- `supabase-backend-employee-repository.ts` (repository implementation)

---

## **Features Included**

✅ **Clean Architecture** - Proper separation of concerns between layers  
✅ **SOLID Principles** - Maintainable and testable code  
✅ **Error Handling** - Custom error classes with context  
✅ **Type Safety** - Full TypeScript support  
✅ **Data Mapping** - Separation between domain and database models  
✅ **Pagination Support** - Built-in pagination with metadata  
✅ **Statistics Support** - Aggregated data queries  
✅ **CRUD Operations** - Complete create, read, update, delete operations  
✅ **Logging** - Structured logging with context  
✅ **Join Support** - Complex queries with table joins  
✅ **Validation** - Input validation and error handling  
✅ **Extensibility** - Easy to extend with new methods

---

## **Customization Points**

When using this template, customize:

1. **Entity Name** - Replace `[Entity]` and `[entity]` placeholders
2. **Module Name** - Replace `[module]` with appropriate module name
3. **Properties** - Define entity-specific properties and relationships
4. **Database Tables** - Specify actual database table names
5. **Joins** - Define relationships and join conditions
6. **Statistics** - Implement domain-specific statistics queries
7. **Validation Rules** - Add business-specific validation logic
8. **Error Types** - Define domain-specific error conditions

This template ensures consistency across all repositories while maintaining flexibility for specific domain requirements.
