import "reflect-metadata";
import { initializeDatabase } from "../dal/AppDataSource";
import { UnitOfWork } from "../dal/UnitOfWork";
import { ContentService } from "../bll/services/ContentService";
import { StorageService } from "../bll/services/StorageService";
import { contentMenu } from "./contentMenu";
import { storageMenu } from "./storageMenu";
import { ask, header, printMenu, err, dim, closeRl } from "./cli";

async function main() {
  await initializeDatabase();

  const uow = new UnitOfWork();
  const contentService = new ContentService(uow);
  const storageService = new StorageService(uow);

  while (true) {
    header("Бібліотека контенту — Варіант 2");
    printMenu([
      ["1", "Контент"],
      ["2", "Сховища"],
      ["0", "Вихід"],
    ]);

    switch (await ask("  Вибір: ")) {
      case "1": await contentMenu(contentService); break;
      case "2": await storageMenu(storageService); break;
      case "0": dim("До побачення!"); closeRl(); process.exit(0);
      default:  err("Невірний вибір");
    }
  }
}

main().catch((e) => {
  console.error("\x1b[31m[FATAL]\x1b[0m", e.message);
  process.exit(1);
});
