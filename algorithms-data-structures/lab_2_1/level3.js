/**
 * Лабораторна робота 2.1 — Рівень 3
 * Розв'язання диференціального рівняння 1-го порядку
 *
 * Варіант 17: dy/dx = cos(x) − y
 * Метод: Рунге-Кутта 2-го порядку (метод Хьюна / середньої точки)
 *
 * Точний розв'язок (аналітичний):
 *   y(x) = (sin(x) + cos(x)) / 2 + C·e^(−x)
 *   При y(0) = y0: C = y0 − 1/2
 */

const readline = require("readline");

// ─── Права частина ДР ─────────────────────────────────────────────────────────
function f(x, y) {
  return Math.cos(x) - y;
}

// ─── Точний розв'язок ─────────────────────────────────────────────────────────
function exactSolution(x, x0, y0) {
  // y = (sin(x) + cos(x))/2 + C·e^(−x)
  // C = (y0 − (sin(x0) + cos(x0))/2) * e^(x0)
  const C = (y0 - (Math.sin(x0) + Math.cos(x0)) / 2) * Math.exp(x0);
  return (Math.sin(x) + Math.cos(x)) / 2 + C * Math.exp(-x);
}

// ─── Метод Рунге-Кутта 2-го порядку (Хьюна) ──────────────────────────────────
// k1 = h · f(xₙ, yₙ)
// k2 = h · f(xₙ + h, yₙ + k1)
// yₙ₊₁ = yₙ + (k1 + k2) / 2
//
// Порядок точності: O(h²) — похибка глобальна O(h²), локальна O(h³)
function rungeKutta2(x0, y0, xEnd, h) {
  const steps = [];
  let x = x0;
  let y = y0;

  steps.push({ x, y, yExact: exactSolution(x, x0, y0), k1: null, k2: null, error: 0 });

  while (x < xEnd - 1e-10) {
    // Не переступаємо xEnd
    if (x + h > xEnd) h = xEnd - x;

    const k1 = h * f(x, y);
    const k2 = h * f(x + h, y + k1);
    const yNext = y + (k1 + k2) / 2;
    const xNext = x + h;

    const yExact = exactSolution(xNext, x0, y0);
    const error  = Math.abs(yNext - yExact);

    steps.push({ x: xNext, y: yNext, yExact, k1, k2, error });
    x = xNext;
    y = yNext;
  }
  return steps;
}

// ─── Вивід таблиці результатів ────────────────────────────────────────────────
function printTable(steps) {
  const colW = 12;
  const sep  = "─".repeat(72);

  console.log("\n  " + sep);
  console.log(
    "   #  |" +
    "     x      |" +
    "   y (RK2)  |" +
    "  y (точний) |" +
    "    k1       |" +
    "    k2       |" +
    "  |похибка|"
  );
  console.log("  " + sep);

  steps.forEach((s, i) => {
    const k1Str = s.k1 !== null ? s.k1.toFixed(6) : "   —      ";
    const k2Str = s.k2 !== null ? s.k2.toFixed(6) : "   —      ";
    console.log(
      `  ${String(i).padStart(3)} | ` +
      `${s.x.toFixed(4).padStart(10)} | ` +
      `${s.y.toFixed(6).padStart(10)} | ` +
      `${s.yExact.toFixed(6).padStart(11)} | ` +
      `${k1Str.padStart(11)} | ` +
      `${k2Str.padStart(11)} | ` +
      `${s.error.toExponential(3).padStart(10)}`
    );
  });

  console.log("  " + sep);

  // Максимальна та середня похибка
  const errors = steps.map(s => s.error);
  const maxErr = Math.max(...errors);
  const avgErr = errors.reduce((a, b) => a + b, 0) / errors.length;
  console.log(`\n  Макс. похибка: ${maxErr.toExponential(4)}`);
  console.log(`  Сер.  похибка: ${avgErr.toExponential(4)}`);
}

// ─── Схема алгоритму ──────────────────────────────────────────────────────────
function printAlgorithmNote() {
  console.log("\n  Алгоритм Рунге-Кутта 2-го порядку (Хьюн):");
  console.log("  ─────────────────────────────────────────────");
  console.log("   k1 = h · f(xₙ, yₙ)");
  console.log("   k2 = h · f(xₙ + h, yₙ + k1)");
  console.log("   yₙ₊₁ = yₙ + (k1 + k2) / 2");
  console.log("  ─────────────────────────────────────────────");
  console.log("  Порядок точності: O(h²)");
  console.log("  Порівняно з Ейлером (O(h¹)) — вдвічі точніший,");
  console.log("  оскільки враховує нахил і на початку, і в кінці кроку.\n");
}

// ─── Головна функція ──────────────────────────────────────────────────────────
function main(x0, y0, xEnd, h) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 3 — Рунге-Кутта 2-го порядку");
  console.log(" Рівняння: dy/dx = cos(x) − y");
  console.log(` Початкові умови: y(${x0}) = ${y0}`);
  console.log(` Інтервал: [${x0}, ${xEnd}],  крок h = ${h}`);
  console.log("════════════════════════════════════════════════════");

  printAlgorithmNote();

  const steps = rungeKutta2(x0, y0, xEnd, h);
  printTable(steps);

  console.log(`\n  Всього кроків: ${steps.length - 1}`);
  console.log(`  Значення у кінцевій точці x=${xEnd}: y ≈ ${steps[steps.length - 1].y.toFixed(8)}\n`);
}

// ─── Введення з клавіатури ────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Розв'язання ДР: dy/dx = cos(x) − y  методом Рунге-Кутта 2-го порядку");
console.log("Введіть: x0 y0 xEnd h  (через пробіл)");
console.log("Або Enter для значень: x0=0, y0=1, xEnd=2, h=0.2\n");

rl.question("Введіть x0 y0 xEnd h: ", (input) => {
  rl.close();
  const parts = input.trim().split(/\s+/);
  let x0 = 0, y0 = 1, xEnd = 2, h = 0.2;
  if (parts.length === 4 && parts[0] !== "") {
    x0   = parseFloat(parts[0]);
    y0   = parseFloat(parts[1]);
    xEnd = parseFloat(parts[2]);
    h    = parseFloat(parts[3]);
  }
  if ([x0, y0, xEnd, h].some(isNaN) || h <= 0 || x0 >= xEnd) {
    console.error("Некоректні параметри. Використовуємо x0=0, y0=1, xEnd=2, h=0.2");
    x0 = 0; y0 = 1; xEnd = 2; h = 0.2;
  }
  main(x0, y0, xEnd, h);
});
