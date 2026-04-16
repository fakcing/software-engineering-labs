/**
 * Лабораторна робота 2.3 — Рівень 3
 * Запис повного переліку вибірок у файл
 *
 * Завдання: записати у файл повний перелік комбінацій C(16,3),
 * отриманих під час розв'язання задачі першого рівня.
 *
 * Алгоритм генерації комбінацій:
 *   Рекурсивний алгоритм зворотного відстеження (backtracking):
 *   1. Починаємо з порожньої поточної комбінації
 *   2. Для кожної позиції обираємо елемент, більший за попередній
 *   3. Коли k елементів набрано — записуємо у файл
 *   4. Рекурсивно повертаємось і пробуємо наступний елемент
 *
 * Складність: O(C(n,k) × k) часу, O(k) пам'яті (не зберігаємо всі одразу)
 */

const fs       = require("fs");
const path     = require("path");
const readline = require("readline");
const { combination, generateCombinations, factorial } = require("./level1");

// ─── Запис комбінацій у файл ─────────────────────────────────────────────────
function writeToFile(filePath, n, k) {
  const students = Array.from({ length: n }, (_, i) => `Студент_${String(i + 1).padStart(2, "0")}`);
  const C        = combination(BigInt(n), BigInt(k));

  // Заголовок файлу
  const header = [
    "═".repeat(60),
    ` Графік чергування — C(${n}, ${k}) = ${C} варіантів`,
    ` Алгоритм: Комбінації без повторень, рекурсивний backtracking`,
    `═`.repeat(60),
    `  №        | Студент 1          | Студент 2          | Студент 3`,
    `─`.repeat(60),
  ].join("\n");

  const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
  stream.write(header + "\n");

  let count = 0;
  for (const combo of generateCombinations(students, k)) {
    count++;
    const line = `  ${String(count).padStart(5)}    | ${combo.map(s => s.padEnd(18)).join(" | ")}`;
    stream.write(line + "\n");
  }

  const footer = [
    "─".repeat(60),
    `  Всього записано варіантів: ${count}`,
    `  Перевірка: C(${n},${k}) = ${C}  ${count === Number(C) ? "✓ збігається" : "✗ помилка"}`,
    "═".repeat(60),
  ].join("\n");

  stream.end(footer + "\n");

  return new Promise((resolve) => stream.on("finish", () => resolve(count)));
}

// ─── Статистика розподілу ────────────────────────────────────────────────────
// Для кожного студента — скільки разів він потрапляє у чергування
function calcDistribution(n, k) {
  // Кожен студент потрапляє рівно C(n-1, k-1) разів
  const timesPerStudent = combination(BigInt(n - 1), BigInt(k - 1));
  const totalSlots      = combination(BigInt(n), BigInt(k)) * BigInt(k);
  return { timesPerStudent, totalSlots };
}

// ─── Альтернативний запис: тільки числа ──────────────────────────────────────
function writeCompactToFile(filePath, n, k) {
  const ids = Array.from({ length: n }, (_, i) => i + 1);
  const C   = combination(BigInt(n), BigInt(k));

  const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
  stream.write(`# C(${n},${k}) = ${C} комбінацій\n`);
  stream.write(`# Формат: №: [елемент1, елемент2, елемент3]\n`);
  stream.write(`# Роздільник: «;»\n\n`);

  let count = 0;
  for (const combo of generateCombinations(ids, k)) {
    count++;
    stream.write(`${count}: [${combo.join(", ")}];\n`);
  }

  stream.end(`\n# Кінець файлу. Всього: ${count} комбінацій.\n`);

  return new Promise((resolve) => stream.on("finish", () => resolve(count)));
}

// ─── Головна функція ─────────────────────────────────────────────────────────
async function main(n, k, outDir) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 3 — Запис комбінацій у файл");
  console.log(`  n = ${n},  k = ${k}`);
  console.log("════════════════════════════════════════════════════");

  const C    = combination(BigInt(n), BigInt(k));
  const dist = calcDistribution(n, k);

  console.log(`\n Загальна кількість комбінацій: C(${n},${k}) = ${C}`);
  console.log(` Кожен студент потрапляє у чергування: ${dist.timesPerStudent} разів`);
  console.log(` Загальна кількість "людино-чергувань": ${dist.totalSlots}`);

  // Алгоритм — покроково
  console.log(`
 Алгоритм генерації (backtracking):
 ─────────────────────────────────────────────────────
  function* generate(arr, k, start=0, current=[]):
    if current.length === k → yield current     // знайшли комбінацію
    for i from start to arr.length - (k - current.length):
      current.push(arr[i])                      // обираємо елемент
      yield* generate(arr, k, i+1, current)     // рекурсія
      current.pop()                             // повертаємось
 ─────────────────────────────────────────────────────`);

  // Запис у повний файл
  const fullPath    = path.join(outDir, "combinations_full.txt");
  const compactPath = path.join(outDir, "combinations_compact.txt");

  console.log(`\n Запис у файл (повний формат): ${fullPath}`);
  const cnt1 = await writeToFile(fullPath, n, k);
  console.log(` ✓ Записано ${cnt1} рядків`);

  console.log(`\n Запис у файл (компактний формат): ${compactPath}`);
  const cnt2 = await writeCompactToFile(compactPath, n, k);
  console.log(` ✓ Записано ${cnt2} комбінацій`);

  // Показати фрагмент файлу
  console.log("\n ─── Перші 8 рядків файлу (компактний) ──────────────");
  const content = fs.readFileSync(compactPath, "utf8").split("\n").slice(0, 11);
  content.forEach(l => console.log("  " + l));
  console.log("  ...\n");

  console.log(" ─── Останні 5 рядків файлу ──────────────────────────");
  const lines = fs.readFileSync(compactPath, "utf8").split("\n");
  lines.slice(-6).forEach(l => console.log("  " + l));
  console.log();
}

// ─── Запуск ──────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Комбінаторика — Рівень 3: Запис C(n,k) у файл");
console.log("Введіть n k (або Enter для n=16, k=3):");

rl.question("n k: ", async (input) => {
  rl.close();
  const parts = input.trim().split(/\s+/);
  let n = 16, k = 3;
  if (parts.length === 2 && parts[0] !== "") {
    n = parseInt(parts[0]);
    k = parseInt(parts[1]);
  }
  if (isNaN(n) || isNaN(k) || n <= 0 || k <= 0 || k > n) {
    n = 16; k = 3;
  }
  await main(n, k, __dirname);
});
