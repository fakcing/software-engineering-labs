import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { ContentItemEntity } from "./ContentItemEntity";

@Entity("storages")
export class StorageEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) name!: string;
  @Column() location!: string;
  @Column({ default: true }) isActive!: boolean;
  @CreateDateColumn() createdAt!: Date;

  @OneToMany(() => ContentItemEntity, (item) => item.storage, { cascade: true })
  items!: ContentItemEntity[];
}
