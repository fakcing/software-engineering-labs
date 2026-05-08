const fs       = require("fs");
const path     = require("path");
const readline = require("readline");

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

const E = State.ERROR;
const TRANSITION = [
  [ State.OPEN,  E,  E, E,  E,  E,  E ],
  [ E,           2,  E, E,  E,  E,  E ],
  [ E,           2,  3, 4,  E,  E,  E ],
  [ E,           E,  E, E,  E,  6,  E ],
  [ E,           E,  E, E,  5,  E,  E ],
  [ E,           E,  E, E,  5,  6,  E ],
  [ E,           E,  E, E,  E,  E,  E ],
  [ E,           E,  E, E,  E,  E,  E ],
];

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

function main(filePath) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 3 — Автомат на таблиці переходів + файл");
  console.log(" Регулярний вираз: ([^A-Z]+(%|\\*[A-Z]+)#");
  console.log(" Роздільники:  «*»  та  «%%»");
  console.log(`  Файл: ${filePath}`);
  console.log("════════════════════════════════════════════════════");

  printTransitionTable();

  const words = readAndSplit(filePath);
  console.log(`\n  Знайдено слів після розбивки: ${words.length}`);

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
