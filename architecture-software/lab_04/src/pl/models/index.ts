export type ContentTypeModel = "book" | "document" | "video" | "audio";

export type ContentFormatModel =
  | "pdf" | "epub" | "mobi" | "docx" | "txt"
  | "mp4" | "avi" | "mkv"
  | "mp3" | "flac" | "wav" | "aac";

export interface StorageResponse {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  itemCount: number;
}

export interface ContentItemResponse {
  id: number;
  title: string;
  author: string;
  type: ContentTypeModel;
  format: ContentFormatModel;
  genre?: string;
  language?: string;
  year?: number;
  pageCount?: number;
  durationSeconds?: number;
  album?: string;
  tags: string[];
  isAvailable: boolean;
  storage: StorageResponse;
}

export interface CreateContentItemRequest {
  title: string;
  author: string;
  type: ContentTypeModel;
  format: ContentFormatModel;
  genre?: string;
  language?: string;
  year?: number;
  pageCount?: number;
  durationSeconds?: number;
  album?: string;
  tags?: string[];
  storageId: number;
}

export interface UpdateContentItemRequest {
  title?: string;
  author?: string;
  format?: ContentFormatModel;
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

export interface CreateStorageRequest {
  name: string;
  location: string;
}

export interface ContentSearchRequest {
  title?: string;
  author?: string;
  type?: ContentTypeModel;
  genre?: string;
  language?: string;
  year?: number;
  storageId?: number;
  isAvailable?: boolean;
}
