import { Logger } from "../interfaces/logger";

/**
 * Domain event interface
 * Base interface for all domain events
 */
export interface IDomainEvent {
  readonly eventId: string;
  readonly timestamp: Date;
}


/**
 * Event handler type
 * Type definition for event handler functions
 */
export type EventHandler<T extends IDomainEvent> = (event: T) => void;

/**
 * Event dispatcher interface
 * Following Domain-Driven Design principles by using domain events
 */
export interface IEventDispatcher {
  /**
   * Dispatch a domain event
   * @param event The event to dispatch
   */
  dispatch<T extends IDomainEvent>(event: T): void;

  /**
   * Subscribe to a domain event
   * @param eventType The event type to subscribe to
   * @param handler The handler function to call when the event is dispatched
   */
  subscribe<T extends IDomainEvent>(
    eventType: new (...args: unknown[]) => T,
    handler: EventHandler<T>
  ): void;

  /**
   * Unsubscribe from a domain event
   * @param eventType The event type to unsubscribe from
   * @param handler The handler function to unsubscribe
   */
  unsubscribe<T extends IDomainEvent>(
    eventType: new (...args: unknown[]) => T,
    handler: EventHandler<T>
  ): void;
}

/**
 * In-memory event dispatcher implementation
 * Simple implementation of the event dispatcher interface
 */
export class InMemoryEventDispatcher implements IEventDispatcher {
  // Using Record to store event handlers by event name
  private handlers: Record<string, Array<EventHandler<IDomainEvent>>> = {};

  /**
   * Constructor
   * @param logger Optional logger for error handling
   */
  constructor(private readonly logger?: Logger) { }

  /**
   * Dispatch a domain event to all subscribed handlers
   * @param event The event to dispatch
   */
  dispatch<T extends IDomainEvent>(event: T): void {
    const eventName = event.constructor.name;
    const handlers = this.handlers[eventName] || [];

    handlers.forEach(handler => {
      try {
        // Safe to cast since T extends IDomainEvent
        (handler as EventHandler<T>)(event);
      } catch (error) {
        this.logger?.error(`Error handling event ${eventName}`, error as Error, { eventId: event.eventId });
      }
    });
  }

  /**
   * Subscribe to a domain event
   * @param eventType The event type to subscribe to
   * @param handler The handler function to call when the event is dispatched
   */
  subscribe<T extends IDomainEvent>(
    eventType: new (...args: unknown[]) => T,
    handler: EventHandler<T>
  ): void {
    const eventName = eventType.name;
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    // Safe to cast since T extends IDomainEvent
    this.handlers[eventName].push(handler as EventHandler<IDomainEvent>);
  }

  /**
   * Unsubscribe from a domain event
   * @param eventType The event type to unsubscribe from
   * @param handler The handler function to unsubscribe
   */
  unsubscribe<T extends IDomainEvent>(
    eventType: new (...args: unknown[]) => T,
    handler: EventHandler<T>
  ): void {
    const eventName = eventType.name;
    const handlers = this.handlers[eventName];

    if (handlers) {
      // Need to find by reference since we can't directly compare functions
      const index = handlers.findIndex(h => h === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}
