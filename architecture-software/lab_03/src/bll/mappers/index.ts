import { ContentItemEntity, ContentType, ContentFormat } from "../../dal/entities/ContentItemEntity";
import { StorageEntity } from "../../dal/entities/StorageEntity";
import { ContentItemDto, StorageDto, CreateContentItemDto } from "../dto";

export function toStorageDto(e: StorageEntity): StorageDto {
  return {
    id: e.id,
    name: e.name,
    location: e.location,
    isActive: e.isActive,
    itemCount: e.items?.length ?? 0,
  };
}

export function toContentItemDto(e: ContentItemEntity): ContentItemDto {
  return {
    id: e.id,
    title: e.title,
    author: e.author,
    type: e.type as ContentItemDto["type"],
    format: e.format as ContentItemDto["format"],
    genre: e.genre,
    language: e.language,
    year: e.year,
    pageCount: e.pageCount,
    durationSeconds: e.durationSeconds,
    album: e.album,
    tags: e.tags ? e.tags.split(",").filter(Boolean) : [],
    isAvailable: e.isAvailable,
    storage: toStorageDto(e.storage),
  };
}

export function toContentItemEntity(dto: CreateContentItemDto): Partial<ContentItemEntity> {
  return {
    title: dto.title,
    author: dto.author,
    type: dto.type as ContentType,
    format: dto.format as ContentFormat,
    genre: dto.genre,
    language: dto.language,
    year: dto.year,
    pageCount: dto.pageCount,
    durationSeconds: dto.durationSeconds,
    album: dto.album,
    tags: dto.tags?.join(","),
    isAvailable: true,
    storageId: dto.storageId,
  };
}
