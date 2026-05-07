import { ContentItemDto, StorageDto } from "../../bll/dto";
import {
  ContentItemResponse, StorageResponse,
  CreateContentItemRequest, UpdateContentItemRequest,
  CreateStorageRequest,
} from "../models";
import { CreateContentItemDto, UpdateContentItemDto } from "../../bll/dto";

export function toStorageResponse(dto: StorageDto): StorageResponse {
  return {
    id: dto.id,
    name: dto.name,
    location: dto.location,
    isActive: dto.isActive,
    itemCount: dto.itemCount,
  };
}

export function toContentItemResponse(dto: ContentItemDto): ContentItemResponse {
  return {
    id: dto.id,
    title: dto.title,
    author: dto.author,
    type: dto.type,
    format: dto.format,
    genre: dto.genre,
    language: dto.language,
    year: dto.year,
    pageCount: dto.pageCount,
    durationSeconds: dto.durationSeconds,
    album: dto.album,
    tags: dto.tags,
    isAvailable: dto.isAvailable,
    storage: toStorageResponse(dto.storage),
  };
}

export function toCreateContentDto(req: CreateContentItemRequest): CreateContentItemDto {
  return {
    title: req.title,
    author: req.author,
    type: req.type,
    format: req.format,
    genre: req.genre,
    language: req.language,
    year: req.year,
    pageCount: req.pageCount,
    durationSeconds: req.durationSeconds,
    album: req.album,
    tags: req.tags,
    storageId: req.storageId,
  };
}

export function toUpdateContentDto(id: number, req: UpdateContentItemRequest): UpdateContentItemDto {
  return {
    id,
    title: req.title,
    author: req.author,
    format: req.format,
    genre: req.genre,
    language: req.language,
    year: req.year,
    pageCount: req.pageCount,
    durationSeconds: req.durationSeconds,
    album: req.album,
    tags: req.tags,
    isAvailable: req.isAvailable,
    storageId: req.storageId,
  };
}
