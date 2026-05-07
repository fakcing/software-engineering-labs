import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export const ask = (q: string): Promise<string> =>
  new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

export const closeRl = () => rl.close();

const pad = (s: string | number, w: number) => String(s ?? "").slice(0, w).padEnd(w);

export function header(title: string) {
  const line = "─".repeat(58);
  console.log(`\n\x1b[36m${line}\x1b[0m`);
  console.log(`\x1b[36m  ${title}\x1b[0m`);
  console.log(`\x1b[36m${line}\x1b[0m`);
}

export function printMenu(items: [string, string][]) {
  console.log();
  for (const [k, label] of items)
    console.log(`  \x1b[33m[${k}]\x1b[0m ${label}`);
  console.log(`  \x1b[90m${"─".repeat(44)}\x1b[0m`);
}

export const ok  = (msg: string) => console.log(`\n\x1b[32m  ✓ ${msg}\x1b[0m`);
export const err = (msg: string) => console.log(`\n\x1b[31m  ✗ ${msg}\x1b[0m`);
export const dim = (msg: string) => console.log(`\x1b[90m  ${msg}\x1b[0m`);

export const pause   = () => ask("\n  Enter для продовження...");
export const confirm = (msg: string) => ask(`  ${msg} (y/n): `).then((a) => a === "y");

export function printContentTable(items: any[]) {
  if (!items.length) { dim("Нічого не знайдено."); return; }
  const sep = `  \x1b[90m${"─".repeat(86)}\x1b[0m`;
  const typeColor: Record<string, string> = {
    book: "\x1b[34m", document: "\x1b[35m", video: "\x1b[33m", audio: "\x1b[36m",
  };
  console.log(sep);
  console.log(`  \x1b[1m${pad("ID",4)}${pad("Тип",10)}${pad("Формат",8)}${pad("Назва",28)}${pad("Автор",18)}${pad("Сховище",14)}Дост.\x1b[0m`);
  console.log(sep);
  for (const i of items) {
    const avail = i.isAvailable ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    const tc = typeColor[i.type] ?? "";
    console.log(`  ${pad(i.id,4)}${tc}${pad(i.type,10)}\x1b[0m${pad(i.format,8)}${pad(i.title,28)}${pad(i.author,18)}${pad(i.storage?.name,14)}${avail}`);
  }
  console.log(sep);
}

export function printStorageTable(storages: any[]) {
  if (!storages.length) { dim("Сховищ немає."); return; }
  const sep = `  \x1b[90m${"─".repeat(62)}\x1b[0m`;
  console.log(sep);
  console.log(`  \x1b[1m${pad("ID",4)}${pad("Назва",22)}${pad("Розташування",26)}${pad("К-сть",6)}Акт.\x1b[0m`);
  console.log(sep);
  for (const s of storages) {
    const active = s.isActive ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    console.log(`  ${pad(s.id,4)}${pad(s.name,22)}${pad(s.location,26)}${pad(s.itemCount,6)}${active}`);
  }
  console.log(sep);
}

export function printDetail(i: any) {
  const row = (label: string, value: any) => {
    if (value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && !value.length))
      console.log(`  \x1b[33m${label.padEnd(18)}\x1b[0m${Array.isArray(value) ? value.join(", ") : value}`);
  };
  console.log(`\n  \x1b[1m#${i.id} — ${i.title}\x1b[0m`);
  console.log(`  \x1b[90m${"─".repeat(44)}\x1b[0m`);
  row("Автор:",      i.author);
  row("Тип:",        i.type);
  row("Формат:",     i.format);
  row("Жанр:",       i.genre);
  row("Мова:",       i.language);
  row("Рік:",        i.year);
  row("Сторінок:",   i.pageCount);
  row("Тривалість:", i.durationSeconds ? `${i.durationSeconds}с` : undefined);
  row("Альбом:",     i.album);
  row("Теги:",       i.tags);
  row("Доступний:",  i.isAvailable ? "Так" : "Ні");
  row("Сховище:",    i.storage ? `${i.storage.name} / ${i.storage.location}` : undefined);
}
