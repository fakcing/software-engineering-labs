const readline = require("readline");

const State = Object.freeze({
  START:     "START",
  OPEN:      "OPEN",
  NC:        "NC",
  AFTER_PCT: "AFTER_PCT",
  STAR:      "STAR",
  CAP:       "CAP",
  ACCEPT:    "ACCEPT",
  ERROR:     "ERROR",
});

function charClass(ch) {
  if (ch === "(")            return "OPEN_PAREN";
  if (ch === "#")            return "HASH";
  if (ch === "%")            return "PERCENT";
  if (ch === "*")            return "STAR";
  if (/[A-Z]/.test(ch))     return "UPPER";
  if (/[^A-Z#%*(]/.test(ch))return "NONCAP";
  return "OTHER";
}

function nextState(state, ch) {
  const cls = charClass(ch);

  switch (state) {

    case State.START:
      switch (cls) {
        case "OPEN_PAREN": return State.OPEN;
        default:           return State.ERROR;
      }

    case State.OPEN:
      switch (cls) {
        case "NONCAP":
        case "PERCENT":
        case "STAR":
        case "HASH":
          if (cls === "NONCAP") return State.NC;
          return State.ERROR;
        default:           return State.ERROR;
      }

    case State.NC:
      switch (cls) {
        case "NONCAP":     return State.NC;
        case "PERCENT":    return State.AFTER_PCT;
        case "STAR":       return State.STAR;
        default:           return State.ERROR;
      }

    case State.AFTER_PCT:
      switch (cls) {
        case "HASH":       return State.ACCEPT;
        default:           return State.ERROR;
      }

    case State.STAR:
      switch (cls) {
        case "UPPER":      return State.CAP;
        default:           return State.ERROR;
      }

    case State.CAP:
      switch (cls) {
        case "UPPER":      return State.CAP;
        case "HASH":       return State.ACCEPT;
        default:           return State.ERROR;
      }

    case State.ACCEPT:     return State.ERROR;
    case State.ERROR:      return State.ERROR;

    default:               return State.ERROR;
  }
}

function analyze(input) {
  let state   = State.START;
  const trace = [];

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
