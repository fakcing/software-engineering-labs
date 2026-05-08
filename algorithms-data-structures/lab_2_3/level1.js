const readline = require("readline");

function factorial(n) {
  if (n < 0n) throw new RangeError("n < 0");
  let result = 1n;
  for (let i = 2n; i <= n; i++) result *= i;
  return result;
}

function combination(n, k) {
  if (k > n) return 0n;
  if (k === 0n || k === n) return 1n;
  if (k > n - k) k = n - k;
  let num = 1n, den = 1n;
  for (let i = 0n; i < k; i++) {
    num *= (n - i);
    den *= (i + 1n);
  }
  return num / den;
}

function arrangement(n, k) {
  if (k > n) return 0n;
  let result = 1n;
  for (let i = n - k + 1n; i <= n; i++) result *= i;
  return result;
}

function permutation(n) {
  return factorial(n);
}

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

  const students = Array.from({ length: n }, (_, i) => `С${i + 1}`);
  const combos   = [];
  for (const c of generateCombinations(students, k)) {
    combos.push(c);
    if (combos.length >= 10) break;
  }

  console.log(` ─── Перші 10 із ${C} варіантів ──────────────────────`);
  combos.forEach((combo, i) => {
    console.log(`  ${String(i + 1).padStart(3)}. { ${combo.join(", ")} }`);
  });
  console.log(`   ... і ще ${Number(C) - 10} варіантів (всі записані у файл — Level 3)\n`);

  return { C, students, k };
}

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
