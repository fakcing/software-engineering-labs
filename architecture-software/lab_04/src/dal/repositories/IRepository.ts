export interface IRepository<T, TId = number> {
  findById(id: TId): Promise<T | null>;
  findAll(): Promise<T[]>;
  findWhere(predicate: Partial<T>): Promise<T[]>;
  add(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
  exists(id: TId): Promise<boolean>;
}
