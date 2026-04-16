/**
 * Лабораторна робота 2.1 — Рівень 1
 * Чисельне інтегрування
 *
 * Варіант 17: ∫₀¹ e^(x²) dx, h = 0.2
 *
 * Методи: трапецій, прямокутників (лівих, правих, середніх), Сімпсона
 */

const readline = require("readline");

// ─── Підінтегральна функція ───────────────────────────────────────────────────
function f(x) {
  return Math.exp(x * x); // e^(x²)
}

// ─── Метод трапецій ───────────────────────────────────────────────────────────
// Площа під кривою апроксимується трапеціями між вузлами сітки.
// I ≈ h * [ f(a)/2 + f(x1) + f(x2) + ... + f(b)/2 ]
function trapezoid(a, b, h) {
  const n = Math.round((b - a) / h);
  let sum = (f(a) + f(b)) / 2;
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  return sum * h;
}

// ─── Метод прямокутників ──────────────────────────────────────────────────────
// Три варіанти: лівих, правих та середніх прямокутників.
// Середніх (найточніший серед трьох):
// I ≈ h * Σ f(xᵢ + h/2), i = 0..n-1
function rectangles(a, b, h) {
  const n = Math.round((b - a) / h);
  let left = 0;
  let right = 0;
  let mid = 0;
  for (let i = 0; i < n; i++) {
    const x = a + i * h;
    left  += f(x);
    right += f(x + h);
    mid   += f(x + h / 2);
  }
  return {
    left:  left  * h,
    right: right * h,
    mid:   mid   * h,
  };
}

// ─── Метод Сімпсона (парабол) ─────────────────────────────────────────────────
// Апроксимує ділянки параболами через три точки.
// I ≈ (h/3) * [ f(x0) + 4f(x1) + 2f(x2) + 4f(x3) + ... + f(xn) ]
// Потребує парного числа відрізків.
function simpson(a, b, h) {
  let n = Math.round((b - a) / h);
  if (n % 2 !== 0) n++; // парна кількість відрізків — умова методу
  const step = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    const x = a + i * step;
    sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x);
  }
  return (step / 3) * sum;
}

// ─── Таблиця вузлів сітки ─────────────────────────────────────────────────────
function printGrid(a, b, h) {
  const n = Math.round((b - a) / h);
  console.log("\n  Таблиця вузлів сітки:");
  console.log("  " + "─".repeat(30));
  console.log("   i  |    xᵢ    |   f(xᵢ)");
  console.log("  " + "─".repeat(30));
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    console.log(
      `  ${String(i).padStart(2)} | ${x.toFixed(4).padStart(8)} | ${f(x).toFixed(6)}`
    );
  }
  console.log("  " + "─".repeat(30));
}

// ─── Точне значення (еталон) ──────────────────────────────────────────────────
// ∫₀¹ e^(x²) dx ≈ 1.46265 (обчислено рядом або WolframAlpha)
const EXACT = 1.4626517459071816;

function printError(label, value) {
  const err = Math.abs(value - EXACT);
  const rel = (err / Math.abs(EXACT)) * 100;
  console.log(
    `  ${label.padEnd(28)} = ${value.toFixed(8)}  |  похибка: ${err.toFixed(2e-8 < err ? 8 : 10)}  (${rel.toFixed(4)}%)`
  );
}

// ─── Головна функція ──────────────────────────────────────────────────────────
function main(a, b, h) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 1 — Чисельне інтегрування");
  console.log(" Функція: f(x) = e^(x²)");
  console.log(` Інтервал: [${a}, ${b}],  крок h = ${h}`);
  console.log("════════════════════════════════════════════════════");

  printGrid(a, b, h);

  const trap  = trapezoid(a, b, h);
  const rect  = rectangles(a, b, h);
  const simp  = simpson(a, b, h);

  console.log("\n  Результати:");
  console.log("  " + "─".repeat(70));
  printError("Трапецій",              trap);
  printError("Прямокутників (ліві)",  rect.left);
  printError("Прямокутників (праві)", rect.right);
  printError("Прямокутників (середні)", rect.mid);
  printError("Сімпсона (параболи)",   simp);
  console.log("  " + "─".repeat(70));
  console.log(`  Точне значення (еталон):       = ${EXACT.toFixed(8)}`);
  console.log("\n  Висновок: метод Сімпсона дає найменшу похибку (порядок O(h⁴))");
  console.log("            метод трапецій — O(h²), прямокутників (середніх) — O(h²)\n");
}

// ─── Введення з клавіатури ────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Чисельне інтегрування f(x) = e^(x²)");
console.log("Натисніть Enter для використання варіанту 17: a=0, b=1, h=0.2");
console.log("Або введіть: a b h  (через пробіл)\n");

rl.question("Введіть параметри (або Enter): ", (input) => {
  rl.close();
  const parts = input.trim().split(/\s+/);
  let a = 0, b = 1, h = 0.2;
  if (parts.length === 3 && parts[0] !== "") {
    a = parseFloat(parts[0]);
    b = parseFloat(parts[1]);
    h = parseFloat(parts[2]);
  }
  if (isNaN(a) || isNaN(b) || isNaN(h) || h <= 0 || a >= b) {
    console.error("Помилка: некоректні параметри. Використовуємо значення варіанту.");
    a = 0; b = 1; h = 0.2;
  }
  main(a, b, h);
});
