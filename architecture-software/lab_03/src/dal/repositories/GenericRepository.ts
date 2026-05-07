import { EntityTarget, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../AppDataSource";
import { IRepository } from "./IRepository";

export class GenericRepository<T extends ObjectLiteral> implements IRepository<T> {
  protected readonly repo: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repo = AppDataSource.getRepository(entity);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  findAll() {
    return this.repo.find();
  }

  findWhere(predicate: Partial<T>) {
    return this.repo.find({ where: predicate as FindOptionsWhere<T> });
  }

  async add(entity: Partial<T>) {
    return this.repo.save(this.repo.create(entity as T));
  }

  update(entity: T) {
    return this.repo.save(entity);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }

  async exists(id: number) {
    const count = await this.repo.count({ where: { id } as unknown as FindOptionsWhere<T> });
    return count > 0;
  }
}
