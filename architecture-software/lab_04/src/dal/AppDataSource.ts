import "reflect-metadata";
import { DataSource } from "typeorm";
import { ContentItemEntity } from "./entities/ContentItemEntity";
import { StorageEntity } from "./entities/StorageEntity";
import * as path from "path";

export const AppDataSource = new DataSource({
  type: "sqljs",
  location: path.join(process.cwd(), "library.db"),
  autoSave: true,
  entities: [ContentItemEntity, StorageEntity],
  synchronize: true,
  logging: false,
});

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}
