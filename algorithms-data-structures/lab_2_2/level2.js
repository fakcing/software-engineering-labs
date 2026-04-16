/**
 * Лабораторна робота 2.2 — Рівень 2
 * Скінченний автомат (синтаксичний аналізатор) на базі switch
 *
 * Варіант 17. Регулярний вираз: ([^A-Z]+(% | \*[A-Z]+)#
 *
 * Розбір шаблону:
 *   (         — literal відкриваюча дужка
 *   [^A-Z]+   — один або більше символів (не A-Z)
 *   %         — символ «%» (перший варіант завершення)
 *   |         — АБО
 *   \*[A-Z]+  — символ «*», за яким один або більше A-Z
 *   )         — literal закриваюча дужка — НЕ потрібна (немає в шаблоні)
 *   #         — символ «#» (кінець)
 *
 * Граф скінченного автомата:
 *
 *          (           [^A-Z]         %             #
 *  S_START ──→ S_OPEN ──────→ S_NC ──────→ S_AFTER_PCT ──→ S_ACCEPT
 *                               │   [^A-Z]   ↑ (self)
 *                               │            
 *                               │    *          [A-Z]       [A-Z]       #
 *                               └──────→ S_STAR ──────→ S_CAP ────→ S_CAP ──→ S_ACCEPT
 *                               (self-loop: [^A-Z] without %,*,#,A-Z stays in S_NC)
 *
 * Таблиця переходів:
 * ┌─────────────┬──────┬────────┬───────┬──────┬───────┬──────┬───────┐
 * │ Стан        │  (   │ [^A-Z] │   %   │  *   │ [A-Z] │  #   │ інше  │
 * ├─────────────┼──────┼────────┼───────┼──────┼───────┼──────┼───────┤
 * │ S_START     │ OPEN │ ERROR  │ ERROR │ERROR │ ERROR │ERROR │ ERROR │
 * │ S_OPEN      │ERROR │  S_NC  │ ERROR │ERROR │ ERROR │ERROR │ ERROR │
 * │ S_NC        │ERROR │  S_NC  │ S_PCT │S_STAR│ ERROR │ERROR │ ERROR │
 * │ S_AFTER_PCT │ERROR │ ERROR  │ ERROR │ERROR │ ERROR │ ACC  │ ERROR │
 * │ S_STAR      │ERROR │ ERROR  │ ERROR │ERROR │ S_CAP │ERROR │ ERROR │
 * │ S_CAP       │ERROR │ ERROR  │ ERROR │ERROR │ S_CAP │ ACC  │ ERROR │
 * │ S_ACCEPT    │ERROR │ ERROR  │ ERROR │ERROR │ ERROR │ERROR │ ERROR │
 * │ S_ERROR     │ERROR │ ERROR  │ ERROR │ERROR │ ERROR │ERROR │ ERROR │
 * └─────────────┴──────┴────────┴───────┴──────┴───────┴──────┴───────┘
 *
 * Стани — реалізовані через Enum (об'єкт з freeze)
 */

const readline = require("readline");

// ─── Enum станів ──────────────────────────────────────────────────────────────
const State = Object.freeze({
  START:     "START",
  OPEN:      "OPEN",      // прочитали '('
  NC:        "NC",        // читаємо [^A-Z]+ (non-capital chars)
  AFTER_PCT: "AFTER_PCT", // прочитали '%', чекаємо '#'
  STAR:      "STAR",      // прочитали '*', чекаємо [A-Z]
  CAP:       "CAP",       // читаємо [A-Z]+
  ACCEPT:    "ACCEPT",    // прийнятий
  ERROR:     "ERROR",     // помилка
});

// ─── Класифікатор символів ────────────────────────────────────────────────────
function charClass(ch) {
  if (ch === "(")            return "OPEN_PAREN";
  if (ch === "#")            return "HASH";
  if (ch === "%")            return "PERCENT";
  if (ch === "*")            return "STAR";
  if (/[A-Z]/.test(ch))     return "UPPER";
  if (/[^A-Z#%*(]/.test(ch))return "NONCAP";  // все крім спеціальних
  return "OTHER";
}

// ─── Один крок автомата (switch) ─────────────────────────────────────────────
function nextState(state, ch) {
  const cls = charClass(ch);

  switch (state) {

    case State.START:
      switch (cls) {
        case "OPEN_PAREN": return State.OPEN;
        default:           return State.ERROR;
      }

    case State.OPEN:
      // Після '(' очікуємо [^A-Z] — тобто все крім великих літер
      // '(' теж є [^A-Z], але ми вже використали його для входу
      switch (cls) {
        case "NONCAP":
        case "PERCENT":    // '%' — теж не A-Z, може бути першим символом NC
        case "STAR":       // '*' — теж не A-Z
        case "HASH":       // '#' — теж не A-Z (але призведе до помилки пізніше)
          // Але ми хочемо потрапити в S_NC лише якщо символ ≠ '%', '*', '#'
          // щоб одразу спрацьовували спеціальні переходи
          if (cls === "NONCAP") return State.NC;
          return State.ERROR;  // після '(' відразу '%', '*', '#' — помилка
        default:           return State.ERROR;
      }

    case State.NC:
      switch (cls) {
        case "NONCAP":     return State.NC;        // ще один [^A-Z]
        case "PERCENT":    return State.AFTER_PCT; // перейшли до '%'
        case "STAR":       return State.STAR;      // перейшли до '*'
        default:           return State.ERROR;     // A-Z, '#', '(' — помилка
      }

    case State.AFTER_PCT:
      switch (cls) {
        case "HASH":       return State.ACCEPT;    // '(' [^A-Z]+ '%' '#' — OK
        default:           return State.ERROR;
      }

    case State.STAR:
      switch (cls) {
        case "UPPER":      return State.CAP;       // '*' A-Z — OK
        default:           return State.ERROR;
      }

    case State.CAP:
      switch (cls) {
        case "UPPER":      return State.CAP;       // ще більших літер
        case "HASH":       return State.ACCEPT;    // завершення '#'
        default:           return State.ERROR;
      }

    case State.ACCEPT:     return State.ERROR;     // зайвий символ
    case State.ERROR:      return State.ERROR;

    default:               return State.ERROR;
  }
}

// ─── Аналіз рядка ─────────────────────────────────────────────────────────────
function analyze(input) {
  let state   = State.START;
  const trace = [];   // лог переходів

  for (let i = 0; i < input.length; i++) {
    const ch   = input[i];
    const prev = state;
    state      = nextState(state, ch);
    trace.push({ pos: i, ch, from: prev, to: state, cls: charClass(ch) });
    if (state === State.ERROR) break;
  }

  const accepted = state === State.ACCEPT;
  return { state, accepted, trace };
}

// ─── Вивід трасування ─────────────────────────────────────────────────────────
function printTrace(input, result) {
  console.log(`\n Рядок: "${input}"`);
  console.log(" " + "─".repeat(60));
  console.log("  Поз | Символ | Клас         | Стан ДО      | Стан ПІСЛЯ");
  console.log(" " + "─".repeat(60));
  result.trace.forEach(({ pos, ch, cls, from, to }) => {
    const chDisp = ch === " " ? "' '" : `'${ch}'`;
    console.log(
      `  ${String(pos).padStart(3)} | ${chDisp.padEnd(6)} | ${cls.padEnd(13)}| ${from.padEnd(13)}| ${to}`
    );
  });
  console.log(" " + "─".repeat(60));
  console.log(` Фінальний стан: ${result.state}`);
  console.log(` Результат: ${result.accepted ? "✓ ПРИЙНЯТИЙ" : "✗ ВІДХИЛЕНИЙ"}\n`);
}

// ─── Приклади для демонстрації ────────────────────────────────────────────────
function runExamples() {
  const examples = [
    { input: "(abc%#",       desc: "коректний — [^A-Z]+ та %#" },
    { input: "(123*ABC#",    desc: "коректний — [^A-Z]+ та *[A-Z]+#" },
    { input: "(x*HELLO#",   desc: "коректний — один [^A-Z] та *[A-Z]+#" },
    { input: "(ab%#extra",  desc: "некоректний — зайві символи після #" },
    { input: "abc%#",       desc: "некоректний — немає початкової «(»" },
    { input: "(ABC%#",      desc: "некоректний — A-Z після «(» замість [^A-Z]" },
    { input: "(%#",         desc: "некоректний — [^A-Z]+ порожній" },
    { input: "(1*abc#",     desc: "некоректний — малі літери після *" },
    { input: "(12*#",       desc: "некоректний — [A-Z]+ порожній після *" },
    { input: "(x%",         desc: "некоректний — немає '#' після '%'" },
  ];

  console.log("\n ─── Демонстраційні приклади ─────────────────────────");
  examples.forEach(({ input, desc }) => {
    const r = analyze(input);
    console.log(
      `  ${r.accepted ? "✓" : "✗"}  "${input.padEnd(15)}"  — ${desc}`
    );
  });
}

// ─── Головна функція ──────────────────────────────────────────────────────────
function main() {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 2 — Скінченний автомат (switch)");
  console.log(" Регулярний вираз: ([^A-Z]+(%|\\*[A-Z]+)#");
  console.log("════════════════════════════════════════════════════");

  console.log(`
 Граф автомата:
                 (           [^A-Z]             %            #
  START ─────→ OPEN ───────→  NC  ──────────→ PCT ───────→ ACCEPT
                               │  (self-loop)
                               │    *           [A-Z]   [A-Z]   #
                               └──────→ STAR ──────→ CAP ────→ ACCEPT
  `);

  runExamples();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const askUser = () => {
    rl.question('\n Введіть рядок для перевірки (або "exit"): ', (input) => {
      if (input.trim().toLowerCase() === "exit") {
        rl.close();
        return;
      }
      const result = analyze(input.trim());
      printTrace(input.trim(), result);
      askUser();
    });
  };
  askUser();
}

main();
module.exports = { State, nextState, analyze };
