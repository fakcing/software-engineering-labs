/**
 * Лабораторна робота 2.2 — Рівень 3
 * Скінченний автомат на основі таблиці переходів + зчитування файлу
 *
 * Варіант 17:
 *   Регулярний вираз:  ([^A-Z]+(% | \*[A-Z]+)#
 *   Роздільники слів:  «*»  та  «%%»
 *
 * Таблиця переходів (transition table):
 *
 * Класи вхідних символів:
 *   0: '('       — відкриваюча дужка
 *   1: [^A-Z%*#(] — звичайний не-великий символ (цифра, мала літера, тощо)
 *   2: '%'       — символ відсотка
 *   3: '*'       — зірочка
 *   4: [A-Z]     — велика літера
 *   5: '#'       — символ решітки
 *   6: інше      — все решта
 *
 * Стани:
 *   0: START      1: OPEN      2: NC
 *   3: AFTER_PCT  4: STAR      5: CAP
 *   6: ACCEPT     7: ERROR
 *
 * Таблиця (рядок = стан, стовпець = клас символу):
 *          '('  [^A-Z] '%'  '*'  [A-Z] '#'  інше
 * START  [ 1,    7,    7,   7,    7,    7,   7  ]  стан 0
 * OPEN   [ 7,    2,    7,   7,    7,    7,   7  ]  стан 1
 * NC     [ 7,    2,    3,   4,    7,    7,   7  ]  стан 2
 * PCT    [ 7,    7,    7,   7,    7,    6,   7  ]  стан 3
 * STAR   [ 7,    7,    7,   7,    5,    7,   7  ]  стан 4
 * CAP    [ 7,    7,    7,   7,    5,    6,   7  ]  стан 5
 * ACCEPT [ 7,    7,    7,   7,    7,    7,   7  ]  стан 6
 * ERROR  [ 7,    7,    7,   7,    7,    7,   7  ]  стан 7
 */

const fs       = require("fs");
const path     = require("path");
const readline = require("readline");

// ─── Enum станів ──────────────────────────────────────────────────────────────
const State = Object.freeze({
  START:     0,
  OPEN:      1,
  NC:        2,
  AFTER_PCT: 3,
  STAR:      4,
  CAP:       5,
  ACCEPT:    6,
  ERROR:     7,
});

const STATE_NAMES = ["START", "OPEN", "NC", "AFTER_PCT", "STAR", "CAP", "ACCEPT", "ERROR"];

// ─── Класи символів ───────────────────────────────────────────────────────────
const CharClass = Object.freeze({
  OPEN_PAREN: 0,
  NONCAP:     1,
  PERCENT:    2,
  STAR:       3,
  UPPER:      4,
  HASH:       5,
  OTHER:      6,
});

function getCharClass(ch) {
  if (ch === "(")               return CharClass.OPEN_PAREN;
  if (ch === "#")               return CharClass.HASH;
  if (ch === "%")               return CharClass.PERCENT;
  if (ch === "*")               return CharClass.STAR;
  if (/[A-Z]/.test(ch))        return CharClass.UPPER;
  if (/[^A-Z#%*(]/.test(ch))   return CharClass.NONCAP;
  return CharClass.OTHER;
}

// ─── Таблиця переходів ────────────────────────────────────────────────────────
// TRANSITION[state][charClass] = nextState
const E = State.ERROR;
const TRANSITION = [
  //  (          NC  %  *  A-Z  #  other
  [ State.OPEN,  E,  E, E,  E,  E,  E ],  // 0: START
  [ E,           2,  E, E,  E,  E,  E ],  // 1: OPEN
  [ E,           2,  3, 4,  E,  E,  E ],  // 2: NC
  [ E,           E,  E, E,  E,  6,  E ],  // 3: AFTER_PCT
  [ E,           E,  E, E,  5,  E,  E ],  // 4: STAR
  [ E,           E,  E, E,  5,  6,  E ],  // 5: CAP
  [ E,           E,  E, E,  E,  E,  E ],  // 6: ACCEPT
  [ E,           E,  E, E,  E,  E,  E ],  // 7: ERROR
];

// ─── Розпізнавання рядка (for-цикл на таблиці) ───────────────────────────────
function recognize(word) {
  let state = State.START;

  for (let i = 0; i < word.length; i++) {
    const ch  = word[i];
    const cls = getCharClass(ch);
    state     = TRANSITION[state][cls];
    if (state === State.ERROR) {
      return { accepted: false, finalState: STATE_NAMES[state], errorAt: i, errorChar: ch };
    }
  }

  const accepted = state === State.ACCEPT;
  return { accepted, finalState: STATE_NAMES[state], errorAt: -1, errorChar: null };
}

// ─── Читання файлу та розбивка за роздільниками ───────────────────────────────
// Роздільники варіанту 17: «*» та «%%»
// Розбиваємо за регулярним виразом /\*|%%/
const DELIMITER_REGEX = /\*|%%/;

function readAndSplit(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines   = content.split(/\r?\n/).filter(l => l.trim() !== "");

  const allWords = [];
  lines.forEach((line, li) => {
    const parts = line.split(DELIMITER_REGEX)
                      .map(w => w.trim())
                      .filter(w => w !== "");
    parts.forEach(w => allWords.push({ word: w, line: li + 1 }));
  });
  return allWords;
}

// ─── Вивід таблиці переходів ──────────────────────────────────────────────────
function printTransitionTable() {
  const headers = ["'('", "[^A-Z]", "'%'", "'*'", "[A-Z]", "'#'", "інше"];
  const rows    = ["START", "OPEN", "NC", "PCT", "STAR", "CAP", "ACCEPT", "ERROR"];

  console.log("\n ─── Таблиця переходів ────────────────────────────────────");
  const hdr = "  Стан       | " + headers.map(h => h.padEnd(8)).join(" | ");
  console.log(hdr);
  console.log(" " + "─".repeat(hdr.length));

  TRANSITION.forEach((row, si) => {
    const cells = row.map(s => STATE_NAMES[s].padEnd(8)).join(" | ");
    console.log(`  ${rows[si].padEnd(11)}| ${cells}`);
  });
  console.log(" " + "─".repeat(hdr.length));
}

// ─── Головна функція ──────────────────────────────────────────────────────────
function main(filePath) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 3 — Автомат на таблиці переходів + файл");
  console.log(" Регулярний вираз: ([^A-Z]+(%|\\*[A-Z]+)#");
  console.log(" Роздільники:  «*»  та  «%%»");
  console.log(`  Файл: ${filePath}`);
  console.log("════════════════════════════════════════════════════");

  printTransitionTable();

  // Читання та розбивка файлу
  const words = readAndSplit(filePath);
  console.log(`\n  Знайдено слів після розбивки: ${words.length}`);

  // Перевірка кожного слова
  const accepted  = [];
  const rejected  = [];

  console.log("\n ─── Аналіз слів ──────────────────────────────────────────");
  console.log("  №  | Слово               | Стан       | Результат");
  console.log(" " + "─".repeat(62));

  words.forEach(({ word, line }, i) => {
    const r = recognize(word);
    const row = `  ${String(i+1).padStart(2)} | ${word.padEnd(20)} | ${r.finalState.padEnd(10)} | `;

    if (r.accepted) {
      accepted.push(word);
      console.log(row + "✓ ПРИЙНЯТИЙ");
    } else {
      rejected.push(word);
      const errInfo = r.errorAt >= 0
        ? `помилка на поз.${r.errorAt} '${r.errorChar}'`
        : `фінальний стан не ACCEPT`;
      console.log(row + `✗ ВІДХИЛЕНИЙ (${errInfo})`);
    }
  });

  console.log(" " + "─".repeat(62));
  console.log(`\n  Прийнято:   ${accepted.length}`);
  console.log(`  Відхилено:  ${rejected.length}`);

  if (accepted.length > 0) {
    console.log("\n ─── Прийняті слова ───────────────────────────────────────");
    accepted.forEach(w => console.log(`    ✓  ${w}`));
  }
  console.log();
}

// ─── Запуск ───────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const defaultFile = path.join(__dirname, "data.txt");

console.log("Рівень 3 — Автомат на таблиці переходів");
console.log(`За замовчуванням файл: ${defaultFile}`);

rl.question("Введіть шлях до файлу (або Enter): ", (input) => {
  rl.close();
  const filePath = input.trim() || defaultFile;
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не знайдено: ${filePath}`);
    process.exit(1);
  }
  main(filePath);
});

module.exports = { State, TRANSITION, recognize, readAndSplit };
