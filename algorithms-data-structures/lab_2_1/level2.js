/**
 * Лабораторна робота 2.1 — Рівень 2
 * Знаходження коренів алгебричного рівняння
 *
 * Варіант 17: y(x) = x³ − 2cos(πx) = 0
 *
 * Методи: половинчастого ділення (бісекції), дотичних (Ньютона), хорд
 */

const readline = require("readline");

const EPSILON = 1e-6; // точність
const MAX_ITER = 1000; // захист від нескінченного циклу

// ─── Функція та її похідні ────────────────────────────────────────────────────
function f(x) {
  return Math.pow(x, 3) - 2 * Math.cos(Math.PI * x);
}

// f'(x) = 3x² + 2π·sin(πx)
function df(x) {
  return 3 * x * x + 2 * Math.PI * Math.sin(Math.PI * x);
}

// f''(x) = 6x + 2π²·cos(πx)
function d2f(x) {
  return 6 * x + 2 * Math.PI * Math.PI * Math.cos(Math.PI * x);
}

// ─── Локалізація коренів ──────────────────────────────────────────────────────
// Ділимо інтервал [a,b] на підінтервали кроком dx.
// Де f змінює знак — там корінь.
function locateRoots(a, b, dx = 0.1) {
  const intervals = [];
  let x = a;
  while (x < b) {
    const x1 = Math.min(x + dx, b);
    if (f(x) * f(x1) < 0) {
      intervals.push([x, x1]);
    }
    x = x1;
  }
  return intervals;
}

// ─── Метод половинчастого ділення (Бісекція) ──────────────────────────────────
// На кожному кроці ділимо відрізок навпіл і беремо ту половину,
// де функція змінює знак. Збіжність гарантована: O(log₂((b-a)/ε))
function bisection(a, b) {
  if (f(a) * f(b) > 0) return null;
  const log = [];
  let iter = 0;
  while ((b - a) / 2 > EPSILON && iter < MAX_ITER) {
    const mid = (a + b) / 2;
    const fm = f(mid);
    log.push({ iter: iter + 1, a, b, mid, fmid: fm });
    if (Math.abs(fm) < EPSILON) { a = b = mid; break; }
    f(a) * fm < 0 ? (b = mid) : (a = mid);
    iter++;
  }
  return { root: (a + b) / 2, iter, log };
}

// ─── Метод дотичних (Ньютона) ─────────────────────────────────────────────────
// Починаємо з точки x₀ (де f·f'' > 0 — умова збіжності).
// xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)
// Квадратична збіжність, але потрібна f' ≠ 0 та гарний початковий x₀.
function newton(a, b) {
  // Вибираємо початкове наближення: кінець де f·f'' > 0
  let x0 = f(a) * d2f(a) > 0 ? a : b;
  const log = [];
  let x = x0;
  let iter = 0;
  while (iter < MAX_ITER) {
    const fx  = f(x);
    const dfx = df(x);
    if (Math.abs(dfx) < 1e-12) break; // f'(x) ≈ 0 — сингулярність
    const xNext = x - fx / dfx;
    log.push({ iter: iter + 1, x, fx, dfx, xNext });
    if (Math.abs(xNext - x) < EPSILON) { x = xNext; break; }
    x = xNext;
    iter++;
  }
  if (x < a - EPSILON || x > b + EPSILON) return null; // вийшов за межі
  return { root: x, iter, log };
}

// ─── Метод хорд ───────────────────────────────────────────────────────────────
// Проводимо хорду між (a, f(a)) і (b, f(b)).
// Точка перетину хорди з OX: x = a − f(a)*(b−a)/(f(b)−f(a))
// Потім замінюємо кінець із тим самим знаком, що й нова точка.
function chord(a, b) {
  if (f(a) * f(b) > 0) return null;
  const log = [];
  let iter = 0;
  let x;
  while (iter < MAX_ITER) {
    const fa = f(a), fb = f(b);
    x = a - fa * (b - a) / (fb - fa);
    const fx = f(x);
    log.push({ iter: iter + 1, a, b, x, fx });
    if (Math.abs(fx) < EPSILON || Math.abs(b - a) < EPSILON) break;
    fa * fx < 0 ? (b = x) : (a = x);
    iter++;
  }
  return { root: x, iter, log };
}

// ─── Вивід таблиці ітерацій ───────────────────────────────────────────────────
function printLog(method, logArr) {
  const maxRows = 8; // показуємо перші та останні ітерації
  const rows = logArr.length > maxRows
    ? [...logArr.slice(0, 4), null, ...logArr.slice(-3)]
    : logArr;

  if (method === "bisection") {
    console.log("   Іт |    a         b       mid      f(mid)");
    console.log("  " + "─".repeat(52));
    rows.forEach(r => {
      if (!r) { console.log("   ..."); return; }
      console.log(
        `  ${String(r.iter).padStart(3)} | ${r.a.toFixed(6)}  ${r.b.toFixed(6)}  ${r.mid.toFixed(6)}  ${r.fmid.toExponential(3)}`
      );
    });
  } else if (method === "newton") {
    console.log("   Іт |    xₙ          f(xₙ)         xₙ₊₁");
    console.log("  " + "─".repeat(52));
    rows.forEach(r => {
      if (!r) { console.log("   ..."); return; }
      console.log(
        `  ${String(r.iter).padStart(3)} | ${r.x.toFixed(6).padStart(10)}  ${r.fx.toExponential(3).padStart(12)}  ${r.xNext.toFixed(8)}`
      );
    });
  } else {
    console.log("   Іт |    a         b         x        f(x)");
    console.log("  " + "─".repeat(56));
    rows.forEach(r => {
      if (!r) { console.log("   ..."); return; }
      console.log(
        `  ${String(r.iter).padStart(3)} | ${r.a.toFixed(5).padStart(9)}  ${r.b.toFixed(5).padStart(9)}  ${r.x.toFixed(8)}  ${r.fx.toExponential(3)}`
      );
    });
  }
}

// ─── Головна функція ──────────────────────────────────────────────────────────
function main(a, b) {
  console.log("\n════════════════════════════════════════════════════");
  console.log(" Рівень 2 — Знаходження коренів");
  console.log(" Рівняння: x³ − 2cos(πx) = 0");
  console.log(` Інтервал: [${a}, ${b}],  ε = ${EPSILON}`);
  console.log("════════════════════════════════════════════════════");

  // Локалізація
  const intervals = locateRoots(a, b);
  if (intervals.length === 0) {
    console.log("\n  На заданому інтервалі коренів не знайдено.");
    console.log("  (f(a) і f(b) одного знаку на всіх підінтервалах)\n");
    return;
  }
  console.log(`\n  Знайдено підінтервалів зі зміною знаку: ${intervals.length}`);
  intervals.forEach(([x1, x2], i) => {
    console.log(`    ${i + 1}. [${x1.toFixed(4)}, ${x2.toFixed(4)}]  f(a)=${f(x1).toFixed(4)}, f(b)=${f(x2).toFixed(4)}`);
  });

  // Для кожного підінтервалу — три методи
  intervals.forEach(([ia, ib], idx) => {
    console.log(`\n  ┌─ Корінь #${idx + 1} на [${ia.toFixed(4)}, ${ib.toFixed(4)}] ─────────────────────`);

    // Бісекція
    const bis = bisection(ia, ib);
    if (bis) {
      console.log(`\n  ● Метод половинчастого ділення (${bis.iter} ітерацій):`);
      printLog("bisection", bis.log);
      console.log(`    Корінь: x ≈ ${bis.root.toFixed(8)},  f(x) = ${f(bis.root).toExponential(4)}`);
    }

    // Ньютон
    const newt = newton(ia, ib);
    if (newt) {
      console.log(`\n  ● Метод дотичних / Ньютона (${newt.iter} ітерацій):`);
      printLog("newton", newt.log);
      console.log(`    Корінь: x ≈ ${newt.root.toFixed(8)},  f(x) = ${f(newt.root).toExponential(4)}`);
    } else {
      console.log(`\n  ● Метод дотичних: не збігся на цьому підінтервалі`);
    }

    // Хорди
    const ch = chord(ia, ib);
    if (ch) {
      console.log(`\n  ● Метод хорд (${ch.iter} ітерацій):`);
      printLog("chord", ch.log);
      console.log(`    Корінь: x ≈ ${ch.root.toFixed(8)},  f(x) = ${f(ch.root).toExponential(4)}`);
    }

    console.log("  └" + "─".repeat(52));
  });

  console.log("\n  Порівняння методів:");
  console.log("  ─────────────────────────────────────────────────────────");
  console.log("  Метод               | Збіжність     | Вимоги");
  console.log("  ─────────────────────────────────────────────────────────");
  console.log("  Бісекція            | O(log₂ 1/ε)  | f(a)·f(b) < 0");
  console.log("  Дотичних (Ньютона)  | Квадратична  | f, f', f''  ≠ 0; f·f'' > 0 на кінці");
  console.log("  Хорд                | Надлінійна   | f(a)·f(b) < 0");
  console.log("  ─────────────────────────────────────────────────────────\n");
}

// ─── Введення з клавіатури ────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Знаходження коренів: x³ − 2cos(πx) = 0");
console.log("Введіть інтервал [a, b] через пробіл, або Enter для [-3, 3]:");

rl.question("Введіть a b: ", (input) => {
  rl.close();
  const parts = input.trim().split(/\s+/);
  let a = -3, b = 3;
  if (parts.length >= 2 && parts[0] !== "") {
    a = parseFloat(parts[0]);
    b = parseFloat(parts[1]);
  }
  if (isNaN(a) || isNaN(b) || a >= b) {
    console.error("Некоректні параметри. Використовуємо [-3, 3].");
    a = -3; b = 3;
  }
  main(a, b);
});
