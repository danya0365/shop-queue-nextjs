/**
 * Interface for a dependency injection container
 */
export interface Container {
  /**
   * Register a constructor for a dependency
   * @param token The token to register the dependency under
   * @param factory A factory function that creates the dependency
   */
  register<T>(token: string | symbol, factory: () => T): void;

  /**
   * Register an instance of a dependency
   * @param token The token to register the dependency under
   * @param instance The instance to register
   */
  registerInstance<T>(token: string | symbol, instance: T): void;

  /**
   * Resolve a dependency
   * @param token The token to resolve
   * @returns The resolved dependency
   */
  resolve<T>(token: string | symbol): T;

  /**
   * Check if a dependency is registered
   * @param token The token to check
   * @returns True if the dependency is registered
   */
  isRegistered(token: string | symbol): boolean;

  /**
   * Create a child container that inherits registrations from this container
   * @returns A new container that inherits from this one
   */
  createChildContainer(): Container;
}

/**
 * A simple dependency injection container implementation
 */
export class SimpleContainer implements Container {
  private registrations = new Map<string | symbol, () => unknown>();
  private parent: Container | null = null;

  constructor(parent: Container | null = null) {
    this.parent = parent;
  }

  /**
   * Register a constructor for a dependency
   * @param token The token to register the dependency under
   * @param factory A factory function that creates the dependency
   */
  register<T>(token: string | symbol, factory: () => T): void {
    this.registrations.set(token, factory);
  }

  /**
   * Register an instance of a dependency
   * @param token The token to register the dependency under
   * @param instance The instance to register
   */
  registerInstance<T>(token: string | symbol, instance: T): void {
    this.registrations.set(token, () => instance);
  }

  /**
   * Resolve a dependency
   * @param token The token to resolve
   * @returns The resolved dependency
   * @throws Error if the dependency is not registered
   */
  resolve<T>(token: string | symbol): T {
    const factory = this.registrations.get(token);

    if (factory) {
      return factory() as T;
    }

    if (this.parent) {
      return this.parent.resolve<T>(token);
    }

    throw new Error(`Dependency not registered: ${String(token)}`);
  }

  /**
   * Check if a dependency is registered
   * @param token The token to check
   * @returns True if the dependency is registered
   */
  isRegistered(token: string | symbol): boolean {
    return (
      this.registrations.has(token) ||
      (this.parent ? this.parent.isRegistered(token) : false)
    );
  }

  /**
   * Create a child container that inherits registrations from this container
   * @returns A new container that inherits from this one
   */
  createChildContainer(): Container {
    return new SimpleContainer(this);
  }
}

/**
 * Create a new container
 * @returns A new container
 */
export function createContainer(): Container {
  return new SimpleContainer();
}
