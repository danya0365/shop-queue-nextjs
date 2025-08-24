import { Category } from '../entities/category';
import { IDomainEvent } from './event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all category events
 * Following Domain-Driven Design principles by using domain events
 */
export abstract class CategoryEvent implements IDomainEvent {
  readonly eventId: string;
  readonly timestamp: Date;
  readonly categoryId: string;

  constructor(categoryId: string) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.categoryId = categoryId;
  }
}

/**
 * Event fired when a category is created
 */
export class CategoryCreatedEvent extends CategoryEvent {
  readonly category: Category;

  constructor(category: Category) {
    super(category.id);
    this.category = category;
  }
}

/**
 * Event fired when a category is updated
 */
export class CategoryUpdatedEvent extends CategoryEvent {
  readonly category: Category;
  readonly previousSlug?: string;

  constructor(category: Category, previousSlug?: string) {
    super(category.id);
    this.category = category;
    this.previousSlug = previousSlug;
  }
}

/**
 * Event fired when a category is deleted
 */
export class CategoryDeletedEvent extends CategoryEvent {
  constructor(categoryId: string) {
    super(categoryId);
  }
}
