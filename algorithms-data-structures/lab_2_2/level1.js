/**
 * Лабораторна робота 2.2 — Рівень 1
 * Пошук текстових образів за допомогою регулярних виразів
 *
 * Варіант 17:
 *   Слово починається символом «{», далі йде послідовність із символів
 *   «0÷9», потім обов'язково символи «--» або «+», за якими слідує
 *   послідовність із символів «0÷9». Слово може закінчуватися символом «%».
 *
 * Регулярний вираз: ^\{[0-9]+(--|[+])[0-9]+%?$
 *
 * Розбір шаблону:
 *   ^         — початок рядка
 *   \{        — обов'язковий символ «{»
 *   [0-9]+    — один або більше цифр (0–9)
 *   (--)      — або два мінуси «--»
 *   |         — АБО
 *   [+]       — символ «+»
 *   [0-9]+    — один або більше цифр (0–9)
 *   %?        — необов'язковий символ «%»
 *   $         — кінець рядка
 */

const fs   = require("fs");
const path = require("path");
const readline = require("readline");

// ─── Регулярний вираз варіанту 17 ────────────────────────────────────────────
const PATTERN = /^\{[0-9]+(--|[+])[0-9]+%?$/;

// ─── Читання файлу і пошук ────────────────────────────────────────────────────
function searchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не знайдено: ${filePath}`);
    process.exit(1);
  }

  const lines   = fs.readFileSync(filePath, "utf8")
                    .split(/\r?\n/)
                    .filter(l => l.trim() !== "");

  const matched = [];
  const rejected = [];

  lines.forEach((word, i) => {
    const trimmed = word.trim();
    if (PATTERN.test(trimmed)) {
      matched.push({ line: i + 1, word: trimmed });
    } else {
      rejected.push({ line: i + 1, word: trimmed });
    }
  });

  return { lines, matched, rejected };
}

// ─── Детальний аналіз слова ───────────────────────────────────────────────────
function analyzeWord(word) {
  if (!PATTERN.test(word)) return "не відповідає";

  const hasMinus = /--/.test(word);
  const hasPlus  = /[+]/.test(word);
  const hasPercent = word.endsWith("%");

  const parts = word.replace(/^\{/, "").replace(/%$/, "");
  const sep   = hasMinus ? "--" : "+";
  const [left, right] = parts.split(sep);

  return `{ + "${left}" + "${sep}" + "${right}"` +
         (hasPercent ? ' + "%" (кінцевий символ)' : "");
}

// ─── Виведення результатів ────────────────────────────────────────────────────
function printResults(filePath, result) {
  const { lines, matched, rejected } = result;

  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 1 — Пошук за регулярним виразом");
  console.log(` Файл: ${filePath}`);
  console.log(" Шаблон: ^\\{[0-9]+(--|[+])[0-9]+%?$");
  console.log("════════════════════════════════════════════════════");

  console.log(`\n Всього рядків у файлі: ${lines.length}`);
  console.log(` Знайдено відповідностей: ${matched.length}`);
  console.log(` Не відповідають: ${rejected.length}`);

  console.log("\n ─── Усі слова (перевірка рядок за рядком) ─────────");
  console.log("  Рядок | Слово               | Результат");
  console.log(" " + "─".repeat(52));

  lines.forEach((w, i) => {
    const word   = w.trim();
    const status = PATTERN.test(word) ? "✓ ВІДПОВІДАЄ" : "✗ НЕ відповідає";
    console.log(
      `  ${String(i + 1).padStart(5)} | ${word.padEnd(20)} | ${status}`
    );
  });

  if (matched.length > 0) {
    console.log("\n ─── Знайдені слова ─────────────────────────────────");
    matched.forEach(({ line, word }) => {
      console.log(`  рядок ${line}: ${word.padEnd(20)}  →  ${analyzeWord(word)}`);
    });
  }

  console.log("\n ─── Розбір шаблону ─────────────────────────────────");
  console.log("  \\{        — символ { (обов'язковий початок)");
  console.log("  [0-9]+   — цифри (мінімум одна) ДО роздільника");
  console.log("  --       — два мінуси (перший варіант роздільника)");
  console.log("  [+]      — символ + (другий варіант роздільника)");
  console.log("  [0-9]+   — цифри (мінімум одна) ПІСЛЯ роздільника");
  console.log("  %?       — символ % (необов'язковий кінець)\n");
}

// ─── Головна функція ──────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const defaultFile = path.join(__dirname, "words.txt");
console.log("Рівень 1 — Пошук слів за регулярним виразом");
console.log(`За замовчуванням файл: ${defaultFile}`);

rl.question("Введіть шлях до файлу (або Enter): ", (input) => {
  rl.close();
  const filePath = input.trim() || defaultFile;
  const result   = searchFile(filePath);
  printResults(filePath, result);
});
