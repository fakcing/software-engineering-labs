export type ContentTypeDto = "book" | "document" | "video" | "audio";

export type ContentFormatDto =
  | "pdf" | "epub" | "mobi" | "docx" | "txt"
  | "mp4" | "avi" | "mkv"
  | "mp3" | "flac" | "wav" | "aac";

export interface StorageDto {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  itemCount: number;
}

export interface ContentItemDto {
  id: number;
  title: string;
  author: string;
  type: ContentTypeDto;
  format: ContentFormatDto;
  genre?: string;
  language?: string;
  year?: number;
  pageCount?: number;
  durationSeconds?: number;
  album?: string;
  tags: string[];
  isAvailable: boolean;
  storage: StorageDto;
}

export interface CreateContentItemDto {
  title: string;
  author: string;
  type: ContentTypeDto;
  format: ContentFormatDto;
  genre?: string;
  language?: string;
  year?: number;
  pageCount?: number;
  durationSeconds?: number;
  album?: string;
  tags?: string[];
  storageId: number;
}

export interface UpdateContentItemDto {
  id: number;
  title?: string;
  author?: string;
  format?: ContentFormatDto;
  genre?: string;
  language?: string;
  year?: number;
  pageCount?: number;
  durationSeconds?: number;
  album?: string;
  tags?: string[];
  isAvailable?: boolean;
  storageId?: number;
}

export interface ContentSearchDto {
  title?: string;
  author?: string;
  type?: ContentTypeDto;
  genre?: string;
  language?: string;
  year?: number;
  storageId?: number;
  isAvailable?: boolean;
}
