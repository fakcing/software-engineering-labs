class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SortedLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insert(value) {
    const node = new ListNode(value);
    if (!this.head || value < this.head.value) {
      node.next = this.head;
      this.head = node;
    } else {
      let cur = this.head;
      while (cur.next && cur.next.value < value) cur = cur.next;
      node.next = cur.next;
      cur.next = node;
    }
    this.size++;
  }

  linearSearch(target) {
    let cur = this.head, i = 0;
    while (cur) {
      if (cur.value === target) return i;
      cur = cur.next;
      i++;
    }
    return -1;
  }

  clear() { this.head = null; this.size = 0; }
}

function linearSearchArray(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateArray(n, max = 1_000_000) {
  return Array.from({ length: n }, () => randomInt(0, max));
}

function measureNs(fn) {
  const start = process.hrtime.bigint();
  fn();
  return Number(process.hrtime.bigint() - start);
}

function avgTime(fn, repeats = 5) {
  let total = 0n;
  for (let i = 0; i < repeats; i++) {
    const start = process.hrtime.bigint();
    fn();
    total += process.hrtime.bigint() - start;
  }
  return Number(total / BigInt(repeats));
}

function nsToMs(ns) { return (ns / 1_000_000).toFixed(4); }

function printRow(label, ns) {
  console.log(`  ${label.padEnd(40)} ${nsToMs(ns).padStart(12)} мс  (${ns.toLocaleString()} нс)`);
}

console.log("--- РІВЕНЬ 1 - Вставка у впорядкований список ---\n");

const N = 20;
const sizes1 = [N, N * N, N * N * N];

console.log("  Розмір N".padEnd(12), "Час (мс)".padStart(16), "Час (нс)".padStart(20));
console.log("  " + "-".repeat(50));

const level1Results = [];

for (const size of sizes1) {
  const data = generateArray(size);
  const list = new SortedLinkedList();

  const ns = avgTime(() => {
    list.clear();
    for (const v of data) list.insert(v);
  }, 1);

  const label = `N=${size.toLocaleString()}`;
  printRow(label, ns);
  level1Results.push({ size, ns });
}

console.log("\n--- РІВЕНЬ 2 - Лінійний пошук: Список vs Масив ---\n");

const SEARCH_REPEATS = 5;
const level2Results = [];

for (const size of sizes1) {
  const data = generateArray(size, 1_000_000);

  const list = new SortedLinkedList();
  data.forEach(v => list.insert(v));
  const arr = [...data].sort((a, b) => a - b);

  const targets = Array.from({ length: 50 }, () => data[randomInt(0, data.length - 1)]);

  const nsListSearch = avgTime(() => {
    targets.forEach(t => list.linearSearch(t));
  }, SEARCH_REPEATS);

  const nsArrSearch = avgTime(() => {
    targets.forEach(t => linearSearchArray(arr, t));
  }, SEARCH_REPEATS);

  const label = `N=${size.toLocaleString()}`;
  console.log(`  [${label}]`);
  printRow("  Список (лінійний пошук)", nsListSearch);
  printRow("  Масив  (лінійний пошук)", nsArrSearch);
  console.log();

  level2Results.push({ size, nsList: nsListSearch, nsArr: nsArrSearch });
}

console.log("--- РІВЕНЬ 3 - Best / Worst / Average (N=5000) ---\n");

const N3 = 5_000;
const data3 = generateArray(N3, 1_000_000);
const sorted3 = [...data3].sort((a, b) => a - b);

const list3 = new SortedLinkedList();
data3.forEach(v => list3.insert(v));

const arr3 = [...sorted3];

const bestTarget = sorted3[0];
const worstTarget = -1;
const avgTarget = sorted3[Math.floor(N3 / 2)];

const REPS3 = 10;

const cases = [
  { label: "Best  (перший елемент)",    target: bestTarget },
  { label: "Avg   (середній елемент)",  target: avgTarget },
  { label: "Worst (елемент відсутній)", target: worstTarget },
];

console.log("  Список:\n");
cases.forEach(({ label, target }) => {
  const ns = avgTime(() => list3.linearSearch(target), REPS3);
  printRow(`  ${label}`, ns);
});

console.log("\n  Масив:\n");
cases.forEach(({ label, target }) => {
  const ns = avgTime(() => linearSearchArray(arr3, target), REPS3);
  printRow(`  ${label}`, ns);
});

const { writeFileSync } = require("fs");

let csv1 = "N,Час вставки (мс)\n";
level1Results.forEach(r => csv1 += `${r.size},${nsToMs(r.ns)}\n`);
writeFileSync("level1_chart.csv", csv1);
console.log("\n  [i] Дані для графіку рівня 1 -> level1_chart.csv");

let csv2 = "N,Список (мс),Масив (мс)\n";
level2Results.forEach(r => csv2 += `${r.size},${nsToMs(r.nsList)},${nsToMs(r.nsArr)}\n`);
writeFileSync("level2_chart.csv", csv2);
console.log("  [i] Дані для графіку рівня 2 -> level2_chart.csv");

let csv3 = "Випадок,Список (мс),Масив (мс)\n";
const case3Labels = ["Best", "Average", "Worst"];
const list3Times = cases.map(({ target }) => avgTime(() => list3.linearSearch(target), REPS3));
const arr3Times = cases.map(({ target }) => avgTime(() => linearSearchArray(arr3, target), REPS3));
case3Labels.forEach((lbl, i) => {
  csv3 += `${lbl},${nsToMs(list3Times[i])},${nsToMs(arr3Times[i])}\n`;
});
writeFileSync("level3_chart.csv", csv3);
console.log("  [i] Дані для графіку рівня 3 -> level3_chart.csv\n");
