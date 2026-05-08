const readline = require("readline");

function factorial(n) {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}

function analyzeWord(word) {
  const freq = {};
  for (const ch of word) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}

function permutationWithRepetition(word) {
  const freq   = analyzeWord(word);
  const n      = word.length;
  const numBig = factorial(n);

  let den = 1n;
  for (const cnt of Object.values(freq)) {
    den *= factorial(cnt);
  }

  return { result: numBig / den, numerator: numBig, denominator: den, freq, n };
}

function comparisonTable(word) {
  const n = word.length;
  const N = BigInt(n);

  const pureP = factorial(n);

  const { result } = permutationWithRepetition(word);

  const k = 3n;
  const C = factorial(N) / (factorial(k) * factorial(N - k));

  return { pureP, withRep: result, C };
}

function nextPermutation(arr) {
  const a = [...arr];
  let i = a.length - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i < 0) return null;
  let j = a.length - 1;
  while (a[j] <= a[i]) j--;
  [a[i], a[j]] = [a[j], a[i]];
  let left = i + 1, right = a.length - 1;
  while (left < right) {
    [a[left], a[right]] = [a[right], a[left]];
    left++; right--;
  }
  return a;
}

function demoPermutations(word, count = 12) {
  const chars  = word.split("").sort();
  const demos  = [chars.join("")];
  let current  = chars;

  while (demos.length < count) {
    const next = nextPermutation(current);
    if (!next) break;
    const str = next.join("");
    if (str !== demos[demos.length - 1]) demos.push(str);
    current = next;
  }
  return demos;
}

function solve(word) {
  const { result, numerator, denominator, freq, n } = permutationWithRepetition(word);
  const comp = comparisonTable(word);

  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 2 — Перестановки з повтореннями");
  console.log("════════════════════════════════════════════════════");

  console.log(`
 Умова задачі:
   Слово: «${word}»
   Кількість букв: n = ${n}
   Знайти: кількість різних слів із цих букв.

 Аналіз типу задачі:
   ✓ Використовуємо ВСІ букви (перестановка, не комбінація)
   ✓ Є букви, що ПОВТОРЮЮТЬСЯ (переставляємо з повтореннями)
   ✓ Різний порядок → різне слово (порядок важливий)
   → Тип: ПЕРЕСТАНОВКА з повтореннями  P(n; k₁, k₂, ..., km)
`);

  console.log(" ─── Аналіз букв слова ───────────────────────────────");
  const letters = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  letters.forEach(([ch, cnt]) => {
    const mark = cnt > 1 ? ` ← повторюється ${cnt} рази` : "";
    console.log(`   «${ch}» — ${cnt}${mark}`);
  });

  console.log(`\n ─── Обчислення ──────────────────────────────────────`);
  console.log(` Формула: P(n; k₁,...,km) = n! / (k₁! × ... × km!)`);
  console.log(` n = ${n}`);

  const repetitions = Object.entries(freq).filter(([, v]) => v > 1);
  const denomParts  = repetitions.map(([ch, cnt]) => `${cnt}! (${ch})`).join(" × ");
  console.log(` Повторення: ${denomParts || "немає"}`);
  console.log(` P = ${n}! / (${denomParts || "1"})`);
  console.log(`   = ${numerator} / ${denominator}`);
  console.log(`   = ${result}`);

  console.log("\n ─── Порівняння типів вибірок ────────────────────────");
  console.log(`  P(${n})         — Перестановка БЕЗ повторень (усі різні): ${comp.pureP}`);
  console.log(`  P(${n};2,2,2)   — Перестановка З повтореннями (наша):    ${comp.withRep}`);
  console.log(`  C(${n},3)        — Комбінація (вибрати 3 з ${n}):             ${comp.C}`);
  console.log(`\n  Зменшення: ${comp.pureP} / ${comp.withRep} = у ${Number(comp.pureP) / Number(comp.withRep)} разів менше`);
  console.log(`  (саме у стільки разів повторення «скорочують» кількість слів)\n`);

  console.log(` ✓ Відповідь: із букв слова «${word}»`);
  console.log(`              можна скласти  ${result}  різних слів\n`);

  console.log(" ─── Приклади перестановок (12 з перших лексикографічно) ─");
  const demos = demoPermutations(word, 12);
  demos.forEach((w, i) => console.log(`   ${String(i + 1).padStart(2)}. ${w}`));
  console.log(`   ... загалом ${result} варіантів\n`);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Комбінаторика — Рівень 2: Перестановки з повтореннями");
console.log("Варіант 17: слово «програмування»");
console.log("Введіть слово (або Enter для варіанту 17):");

rl.question("Слово: ", (input) => {
  rl.close();
  const word = input.trim() || "програмування";
  if (word.length === 0) {
    console.error("Порожнє слово.");
    process.exit(1);
  }
  solve(word);
});

module.exports = { analyzeWord, permutationWithRepetition, factorial };
