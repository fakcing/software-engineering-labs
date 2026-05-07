import { ContentService } from "../bll/services/ContentService";
import { CreateContentItemDto, UpdateContentItemDto, ContentSearchDto } from "../bll/dto";
import { ask, header, printMenu, ok, err, dim, pause, confirm, printContentTable, printDetail } from "./cli";

const TYPES = ["book", "document", "video", "audio"] as const;
const FORMATS: Record<string, string[]> = {
  book:     ["pdf", "epub", "mobi", "txt"],
  document: ["pdf", "docx", "txt"],
  video:    ["mp4", "avi", "mkv"],
  audio:    ["mp3", "flac", "wav", "aac"],
};

export async function contentMenu(service: ContentService) {
  while (true) {
    header("Контент");
    printMenu([
      ["1", "Список всього контенту"],
      ["2", "Деталі елемента"],
      ["3", "Додати контент"],
      ["4", "Редагувати контент"],
      ["5", "Змінити доступність"],
      ["6", "Видалити контент"],
      ["7", "Пошук"],
      ["0", "← Назад"],
    ]);

    switch (await ask("  Вибір: ")) {
      case "1": await listAll(service); break;
      case "2": await viewDetail(service); break;
      case "3": await addItem(service); break;
      case "4": await editItem(service); break;
      case "5": await toggleAvailability(service); break;
      case "6": await deleteItem(service); break;
      case "7": await searchItems(service); break;
      case "0": return;
      default:  err("Невірний вибір");
    }
  }
}

async function listAll(service: ContentService) {
  header("Весь контент");
  try {
    const items = await service.getAll();
    printContentTable(items);
    dim(`Всього: ${items.length}`);
  } catch (e: any) { err(e.message); }
  await pause();
}

async function viewDetail(service: ContentService) {
  header("Деталі");
  const id = parseInt(await ask("  ID: "));
  try { printDetail(await service.getById(id)); }
  catch (e: any) { err(e.message); }
  await pause();
}

async function addItem(service: ContentService) {
  header("Додати контент");

  const title  = await ask("  Назва: ");
  const author = await ask("  Автор: ");

  console.log("  Тип: " + TYPES.map((t, i) => `[${i + 1}] ${t}`).join("  "));
  const ti = parseInt(await ask("  Тип (1-4): ")) - 1;
  if (ti < 0 || ti > 3) { err("Невірний тип"); await pause(); return; }
  const type = TYPES[ti];

  const fmts = FORMATS[type];
  console.log("  Формат: " + fmts.map((f, i) => `[${i + 1}] ${f}`).join("  "));
  const fi = parseInt(await ask(`  Формат (1-${fmts.length}): `)) - 1;
  if (fi < 0 || fi >= fmts.length) { err("Невірний формат"); await pause(); return; }

  const dto: CreateContentItemDto = {
    title, author,
    type: type as any,
    format: fmts[fi] as any,
    storageId: parseInt(await ask("  ID сховища: ")),
  };

  const genre = await ask("  Жанр: ");       if (genre) dto.genre = genre;
  const lang  = await ask("  Мова: ");       if (lang)  dto.language = lang;
  const year  = await ask("  Рік: ");        if (year)  dto.year = +year;
  const tags  = await ask("  Теги (через кому): ");
  if (tags) dto.tags = tags.split(",").map((t) => t.trim()).filter(Boolean);

  if (type === "book" || type === "document") {
    const p = await ask("  Кількість сторінок: ");
    if (p) dto.pageCount = +p;
  }
  if (type === "video" || type === "audio") {
    const d = await ask("  Тривалість (сек): ");
    if (d) dto.durationSeconds = +d;
  }
  if (type === "audio") {
    const a = await ask("  Альбом: ");
    if (a) dto.album = a;
  }

  try { const c = await service.create(dto); ok(`Додано: "${c.title}" (ID: ${c.id})`); }
  catch (e: any) { err(e.message); }
  await pause();
}

async function editItem(service: ContentService) {
  header("Редагувати");
  const id = parseInt(await ask("  ID: "));
  try {
    const item = await service.getById(id);
    printDetail(item);
    dim("Залиш порожнім, щоб не змінювати");

    const dto: UpdateContentItemDto = { id };
    const t = await ask(`  Назва [${item.title}]: `);          if (t) dto.title = t;
    const a = await ask(`  Автор [${item.author}]: `);         if (a) dto.author = a;
    const g = await ask(`  Жанр [${item.genre ?? ""}]: `);     if (g) dto.genre = g;
    const l = await ask(`  Мова [${item.language ?? ""}]: `);  if (l) dto.language = l;
    const y = await ask(`  Рік [${item.year ?? ""}]: `);       if (y) dto.year = +y;
    const s = await ask(`  ID сховища [${item.storage.id}]: `); if (s) dto.storageId = +s;

    const updated = await service.update(dto);
    ok(`Оновлено: "${updated.title}"`);
  } catch (e: any) { err(e.message); }
  await pause();
}

async function toggleAvailability(service: ContentService) {
  header("Змінити доступність");
  const id = parseInt(await ask("  ID: "));
  try {
    const item = await service.getById(id);
    const next = !item.isAvailable;
    if (await confirm(`Встановити "${next ? "доступний" : "недоступний"}" для "${item.title}"?`)) {
      const u = await service.setAvailability(id, next);
      ok(`"${u.title}" тепер ${u.isAvailable ? "доступний" : "недоступний"}`);
    } else {
      dim("Скасовано.");
    }
  } catch (e: any) { err(e.message); }
  await pause();
}

async function deleteItem(service: ContentService) {
  header("Видалити контент");
  const id = parseInt(await ask("  ID: "));
  try {
    const item = await service.getById(id);
    if (await confirm(`Видалити "${item.title}"?`)) {
      await service.delete(id);
      ok("Видалено.");
    } else {
      dim("Скасовано.");
    }
  } catch (e: any) { err(e.message); }
  await pause();
}

async function searchItems(service: ContentService) {
  header("Пошук");
  dim("Залиш порожнім, щоб пропустити фільтр");

  const dto: ContentSearchDto = {};
  const title  = await ask("  Назва містить: ");   if (title)  dto.title = title;
  const author = await ask("  Автор містить: ");   if (author) dto.author = author;

  console.log("  Тип: [1] book  [2] document  [3] video  [4] audio  [Enter] будь-який");
  const typeMap: Record<string, any> = { "1": "book", "2": "document", "3": "video", "4": "audio" };
  const tc = await ask("  Тип: ");
  if (typeMap[tc]) dto.type = typeMap[tc];

  const genre = await ask("  Жанр: ");             if (genre)  dto.genre = genre;
  const lang  = await ask("  Мова: ");             if (lang)   dto.language = lang;
  const year  = await ask("  Рік: ");              if (year)   dto.year = +year;
  const av    = await ask("  Тільки доступні? (y/n): ");
  if (av === "y") dto.isAvailable = true;
  if (av === "n") dto.isAvailable = false;

  try {
    const results = await service.search(dto);
    dim(`Знайдено: ${results.length}`);
    printContentTable(results);
  } catch (e: any) { err(e.message); }
  await pause();
}
