import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { StorageEntity } from "./StorageEntity";

export enum ContentType {
  Book = "book", Document = "document", Video = "video", Audio = "audio",
}

export enum ContentFormat {
  Pdf = "pdf", Epub = "epub", Mobi = "mobi", Docx = "docx", Txt = "txt",
  Mp4 = "mp4", Avi = "avi", Mkv = "mkv",
  Mp3 = "mp3", Flac = "flac", Wav = "wav", Aac = "aac",
}

@Entity("content_items")
export class ContentItemEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() title!: string;
  @Column() author!: string;
  @Column({ type: "varchar" }) type!: ContentType;
  @Column({ type: "varchar" }) format!: ContentFormat;
  @Column({ nullable: true }) genre?: string;
  @Column({ nullable: true }) language?: string;
  @Column({ nullable: true, type: "int" }) year?: number;
  @Column({ nullable: true, type: "int" }) pageCount?: number;
  @Column({ nullable: true, type: "int" }) durationSeconds?: number;
  @Column({ nullable: true }) album?: string;
  @Column({ nullable: true }) tags?: string;
  @Column({ default: true }) isAvailable!: boolean;
  @Column() storageId!: number;

  @ManyToOne(() => StorageEntity, (s) => s.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storageId" })
  storage!: StorageEntity;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
