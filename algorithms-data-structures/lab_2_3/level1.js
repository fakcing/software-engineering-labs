/**
 * Лабораторна робота 2.3 — Рівень 1
 * Комбінаторні алгоритми. Вибірка БЕЗ повторень.
 *
 * Варіант 17:
 *   Дано:  Студенти, що проживають у гуртожитку на одному поверсі — 16 осіб
 *   Знайти: Скількома способами можна скласти графік чергування на один день,
 *           якщо кожен день чергують 3 студенти?
 *
 * Тип задачі: КОМБІНАЦІЯ без повторень — C(n, k)
 *   Порядок обраних студентів НЕ важливий (просто хто чергує),
 *   кожен студент може бути обраний лише один раз.
 *
 * Формула: C(n,k) = n! / (k! × (n−k)!)
 *           C(16,3) = 16! / (3! × 13!) = 560
 *
 * Чому КОМБІНАЦІЯ, а не РОЗМІЩЕННЯ?
 *   Розміщення (A) — якби у чергуванні були ролі: "старший", "молодший" тощо.
 *   Тут всі троє рівноправні — просто "чергують", тому порядок неважливий → C.
 */

const readline = require("readline");

// ─── BigInt-факторіал ────────────────────────────────────────────────────────
function factorial(n) {
  if (n < 0n) throw new RangeError("n < 0");
  let result = 1n;
  for (let i = 2n; i <= n; i++) result *= i;
  return result;
}

// ─── C(n, k) — комбінація без повторень ──────────────────────────────────────
// C(n,k) = n! / (k! × (n-k)!)
// Оптимізовано: рахуємо тільки k множників зверху і ділимо на k!
function combination(n, k) {
  if (k > n) return 0n;
  if (k === 0n || k === n) return 1n;
  if (k > n - k) k = n - k;  // C(n,k) = C(n,n-k), беремо менший k
  let num = 1n, den = 1n;
  for (let i = 0n; i < k; i++) {
    num *= (n - i);
    den *= (i + 1n);
  }
  return num / den;
}

// ─── A(n, k) — розміщення без повторень (для порівняння) ─────────────────────
// A(n,k) = n! / (n-k)!
function arrangement(n, k) {
  if (k > n) return 0n;
  let result = 1n;
  for (let i = n - k + 1n; i <= n; i++) result *= i;
  return result;
}

// ─── P(n) — перестановка ─────────────────────────────────────────────────────
function permutation(n) {
  return factorial(n);
}

// ─── Генерація всіх комбінацій ────────────────────────────────────────────────
// Рекурсивний алгоритм: обираємо по одному елементу з масиву
function* generateCombinations(arr, k, start = 0, current = []) {
  if (current.length === k) {
    yield [...current];
    return;
  }
  for (let i = start; i <= arr.length - (k - current.length); i++) {
    current.push(arr[i]);
    yield* generateCombinations(arr, k, i + 1, current);
    current.pop();
  }
}

// ─── Виведення вирішення задачі ───────────────────────────────────────────────
function solve(n, k) {
  const N = BigInt(n), K = BigInt(k);

  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 1 — Комбінаторна задача (Комбінації)");
  console.log("════════════════════════════════════════════════════");

  console.log(`
 Умова задачі:
   Студентів на поверсі: n = ${n}
   Чергують щодня:       k = ${k}
   Знайти: кількість способів скласти графік чергування.

 Аналіз типу задачі:
   ✓ Порядок НЕ важливий (немає ролей серед чергуючих)
   ✓ Повторення НЕможливі (один студент не може чергувати двічі за день)
   → Тип: КОМБІНАЦІЯ без повторень  C(n, k)
`);

  const C = combination(N, K);
  const A = arrangement(N, K);

  console.log(" ─── Обчислення ──────────────────────────────────────");
  console.log(` Формула:  C(n,k) = n! / (k! × (n−k)!)`);
  console.log(` C(${n},${k}) = ${n}! / (${k}! × ${n-k}!)`);
  console.log(`         = ${factorial(N)} / (${factorial(K)} × ${factorial(N-K)})`);
  console.log(`         = ${C}`);

  console.log("\n ─── Порівняння типів вибірок ────────────────────────");
  console.log(`  C(${n},${k}) — Комбінація (порядок неважливий):  ${C}`);
  console.log(`  A(${n},${k}) — Розміщення (порядок важливий):    ${A}`);
  console.log(`  P(${n})   — Перестановка (всі елементи):         ${permutation(N)}`);

  console.log(`\n ✓ Відповідь: ${C} способів скласти графік чергування`);
  console.log(`   (для порівняння: якби порядок мав значення — ${A} способів)\n`);

  // Демонстрація перших комбінацій
  const students = Array.from({ length: n }, (_, i) => `С${i + 1}`);
  const combos   = [];
  for (const c of generateCombinations(students, k)) {
    combos.push(c);
    if (combos.length >= 10) break;  // тільки перші 10 для демо
  }

  console.log(` ─── Перші 10 із ${C} варіантів ──────────────────────`);
  combos.forEach((combo, i) => {
    console.log(`  ${String(i + 1).padStart(3)}. { ${combo.join(", ")} }`);
  });
  console.log(`   ... і ще ${Number(C) - 10} варіантів (всі записані у файл — Level 3)\n`);

  return { C, students, k };
}

// ─── Введення з клавіатури ────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Комбінаторика — Рівень 1: Комбінації без повторень");
console.log("Варіант 17: 16 студентів, 3 чергують");
console.log("Введіть n k (або Enter для варіанту 17: n=16, k=3):");

rl.question("n k: ", (input) => {
  rl.close();
  const parts = input.trim().split(/\s+/);
  let n = 16, k = 3;
  if (parts.length === 2 && parts[0] !== "") {
    n = parseInt(parts[0]);
    k = parseInt(parts[1]);
  }
  if (isNaN(n) || isNaN(k) || n <= 0 || k <= 0 || k > n) {
    console.error("Некоректні дані. Використовуємо n=16, k=3.");
    n = 16; k = 3;
  }
  solve(n, k);
});

module.exports = { combination, arrangement, permutation, factorial, generateCombinations };
