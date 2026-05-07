import { StorageService } from "../bll/services/StorageService";
import { ask, header, printMenu, ok, err, dim, pause, confirm, printStorageTable } from "./cli";

export async function storageMenu(service: StorageService) {
  while (true) {
    header("Сховища");
    printMenu([
      ["1", "Список сховищ"],
      ["2", "Додати сховище"],
      ["3", "Деактивувати сховище"],
      ["4", "Видалити сховище"],
      ["0", "← Назад"],
    ]);

    switch (await ask("  Вибір: ")) {
      case "1": await listStorages(service); break;
      case "2": await addStorage(service); break;
      case "3": await deactivateStorage(service); break;
      case "4": await deleteStorage(service); break;
      case "0": return;
      default:  err("Невірний вибір");
    }
  }
}

async function listStorages(service: StorageService) {
  header("Всі сховища");
  try {
    const storages = await service.getAll();
    printStorageTable(storages);
    dim(`Всього: ${storages.length}`);
  } catch (e: any) { err(e.message); }
  await pause();
}

async function addStorage(service: StorageService) {
  header("Додати сховище");
  const name     = await ask("  Назва: ");
  const location = await ask("  Розташування: ");
  try {
    const s = await service.create(name, location);
    ok(`Сховище "${s.name}" створено (ID: ${s.id})`);
  } catch (e: any) { err(e.message); }
  await pause();
}

async function deactivateStorage(service: StorageService) {
  header("Деактивувати сховище");
  const id = parseInt(await ask("  ID: "));
  try {
    const s = await service.getById(id);
    if (await confirm(`Деактивувати "${s.name}"?`)) {
      await service.deactivate(id);
      ok("Деактивовано.");
    } else {
      dim("Скасовано.");
    }
  } catch (e: any) { err(e.message); }
  await pause();
}

async function deleteStorage(service: StorageService) {
  header("Видалити сховище");
  const id = parseInt(await ask("  ID: "));
  try {
    const s = await service.getById(id);
    if (await confirm(`Видалити "${s.name}"? Це незворотньо.`)) {
      await service.delete(id);
      ok("Видалено.");
    } else {
      dim("Скасовано.");
    }
  } catch (e: any) { err(e.message); }
  await pause();
}
