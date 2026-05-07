import { ContentItemRepository } from "./repositories/ContentItemRepository";
import { StorageRepository } from "./repositories/StorageRepository";

export interface IUnitOfWork {
  readonly content: ContentItemRepository;
  readonly storages: StorageRepository;
}

export class UnitOfWork implements IUnitOfWork {
  readonly content = new ContentItemRepository();
  readonly storages = new StorageRepository();
}
