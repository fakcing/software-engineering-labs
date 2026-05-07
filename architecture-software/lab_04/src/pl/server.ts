import "reflect-metadata";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "../dal/AppDataSource";
import { createContainer } from "./container";
import { createContentRouter } from "./controllers/ContentController";
import { createStorageRouter } from "./controllers/StorageController";

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  await initializeDatabase();

  const container = createContainer();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/content", createContentRouter(container.contentService));
  app.use("/api/storages", createStorageRouter(container.storageService));

  app.listen(PORT, () => {
    console.log(`Content Library API running on http://localhost:${PORT}`);
    console.log(`  GET    /api/content`);
    console.log(`  GET    /api/content/search?title=...&type=...&author=...`);
    console.log(`  GET    /api/content/:id`);
    console.log(`  POST   /api/content`);
    console.log(`  PUT    /api/content/:id`);
    console.log(`  PATCH  /api/content/:id/availability`);
    console.log(`  DELETE /api/content/:id`);
    console.log(`  GET    /api/storages`);
    console.log(`  GET    /api/storages/:id`);
    console.log(`  POST   /api/storages`);
    console.log(`  PATCH  /api/storages/:id/deactivate`);
    console.log(`  DELETE /api/storages/:id`);
  });
}

bootstrap().catch((e) => {
  console.error("[FATAL]", e.message);
  process.exit(1);
});
