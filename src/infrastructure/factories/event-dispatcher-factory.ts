import { Logger } from "@/src/domain/interfaces/logger";
import { IEventDispatcher, InMemoryEventDispatcher } from '../../domain/events/event-dispatcher';

/**
 * Factory for creating event dispatchers
 * Following the Factory pattern for dependency injection
 */
export class EventDispatcherFactory {
  /**
   * Create an in-memory event dispatcher
   * @param logger Optional logger for error handling
   * @returns An in-memory event dispatcher instance
   */
  public static createInMemoryEventDispatcher(logger?: Logger): IEventDispatcher {
    return new InMemoryEventDispatcher(logger);
  }
}
