import { UnitOfWork } from "../dal/UnitOfWork";
import { ContentService } from "../bll/services/ContentService";
import { StorageService } from "../bll/services/StorageService";

export interface IContainer {
  contentService: ContentService;
  storageService: StorageService;
}

export function createContainer(): IContainer {
  const uow = new UnitOfWork();
  return {
    contentService: new ContentService(uow),
    storageService: new StorageService(uow),
  };
}
