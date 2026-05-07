import { FindOptionsWhere, ILike } from "typeorm";
import { ContentItemEntity, ContentType } from "../entities/ContentItemEntity";
import { GenericRepository } from "./GenericRepository";

export interface ContentSearchCriteria {
  title?: string;
  author?: string;
  type?: ContentType;
  genre?: string;
  language?: string;
  year?: number;
  storageId?: number;
  isAvailable?: boolean;
}

export class ContentItemRepository extends GenericRepository<ContentItemEntity> {
  constructor() {
    super(ContentItemEntity);
  }

  findWithStorage(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["storage"] });
  }

  findAllWithStorage() {
    return this.repo.find({ relations: ["storage"] });
  }

  search(criteria: ContentSearchCriteria) {
    const where: FindOptionsWhere<ContentItemEntity> = {};
    if (criteria.title) where.title = ILike(`%${criteria.title}%`);
    if (criteria.author) where.author = ILike(`%${criteria.author}%`);
    if (criteria.type) where.type = criteria.type;
    if (criteria.genre) where.genre = ILike(`%${criteria.genre}%`);
    if (criteria.language) where.language = criteria.language;
    if (criteria.year) where.year = criteria.year;
    if (criteria.storageId) where.storageId = criteria.storageId;
    if (criteria.isAvailable !== undefined) where.isAvailable = criteria.isAvailable;
    return this.repo.find({ where, relations: ["storage"] });
  }
}
