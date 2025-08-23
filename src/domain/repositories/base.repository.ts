import { BaseEntity } from '../entities/base.entity';

export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected abstract items: T[];

  async findById(id: string): Promise<T | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const newEntity = {
      ...entity,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;
    
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null> {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedEntity = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date(),
    } as T;
    
    this.items[index] = updatedEntity;
    return updatedEntity;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }
}
