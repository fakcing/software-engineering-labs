import { StorageEntity } from "../entities/StorageEntity";
import { GenericRepository } from "./GenericRepository";

export class StorageRepository extends GenericRepository<StorageEntity> {
  constructor() {
    super(StorageEntity);
  }

  findWithItems(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["items"] });
  }

  findAllWithItems() {
    return this.repo.find({ relations: ["items"] });
  }
}
