const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

function fmt(v) {
  if (Math.abs(v) < 1e-10) v = 0;
  return Number(v).toFixed(6).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function printMatrix(name, m) {
  console.log(name + ':');
  for (const row of m) console.log(row.map(fmt).join('\t'));
}

function printSystem(A, b) {
  console.log('Задана СЛАР:');
  for (let i = 0; i < A.length; i++) {
    const parts = [];
    for (let j = 0; j < A[i].length; j++) {
      const c = A[i][j];
      const s = c >= 0 && parts.length ? '+ ' : c < 0 ? '- ' : '';
      parts.push(`${s}${Math.abs(c)}x${j + 1}`);
    }
    console.log(parts.join(' ') + ' = ' + b[i]);
  }
}

function lupDecompose(A) {
  const n = A.length;
  const LU = A.map(r => r.slice());
  const P = Array.from({ length: n }, (_, i) => i);
  for (let k = 0; k < n; k++) {
    let pivot = k;
    let max = Math.abs(LU[k][k]);
    for (let i = k + 1; i < n; i++) {
      const value = Math.abs(LU[i][k]);
      if (value > max) {
        max = value;
        pivot = i;
      }
    }
    if (max < 1e-12) throw new Error('Матриця вироджена');
    if (pivot !== k) {
      [LU[k], LU[pivot]] = [LU[pivot], LU[k]];
      [P[k], P[pivot]] = [P[pivot], P[k]];
    }
    for (let i = k + 1; i < n; i++) {
      LU[i][k] /= LU[k][k];
      for (let j = k + 1; j < n; j++) LU[i][j] -= LU[i][k] * LU[k][j];
    }
  }
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : i > j ? LU[i][j] : 0));
  const U = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i <= j ? LU[i][j] : 0));
  const PMatrix = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => P[i] === j ? 1 : 0));
  return { L, U, P, PMatrix };
}

function solveLUP(L, U, P, b) {
  const n = L.length;
  const pb = P.map(i => b[i]);
  const y = Array(n).fill(0);
  const x = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = pb[i];
    for (let j = 0; j < i; j++) sum -= L[i][j] * y[j];
    y[i] = sum;
  }
  for (let i = n - 1; i >= 0; i--) {
    let sum = y[i];
    for (let j = i + 1; j < n; j++) sum -= U[i][j] * x[j];
    x[i] = sum / U[i][i];
  }
  return x;
}

async function readRows() {
  const defaults = [
    [9, 2, -5, -9, 16],
    [8, 1, -6, -7, -2],
    [6, 3, 0, -1, 24],
    [9, 3, 6, 8, 18]
  ];
  if (!process.stdin.isTTY) {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf8').trim().split(/\r?\n/).filter(Boolean);
    if (input.length === 0) return defaults;
    const rows = input.slice(0, 4).map(line => line.trim().split(/\s+/).map(Number));
    if (rows.length !== 4 || rows.some(r => r.length !== 5 || r.some(Number.isNaN))) throw new Error('Потрібно ввести 4 рядки по 5 чисел');
    return rows;
  }
  const rows = [];
  for (let i = 0; i < 4; i++) {
    const line = (await ask(`Рядок ${i + 1} [Enter для варіанта 16]: `)).trim();
    const values = line ? line.split(/\s+/).map(Number) : defaults[i];
    if (values.length !== 5 || values.some(Number.isNaN)) throw new Error('Потрібно ввести 5 чисел');
    rows.push(values);
  }
  return rows;
}

async function main() {
  console.log('Варіант 16. Введіть коефіцієнти 4 рівнянь у форматі: a1 a2 a3 a4 b');
  const rows = await readRows();
  rl.close();
  const A = rows.map(r => r.slice(0, 4));
  const b = rows.map(r => r[4]);
  printSystem(A, b);
  const { L, U, P, PMatrix } = lupDecompose(A);
  const x = solveLUP(L, U, P, b);
  printMatrix('L', L);
  printMatrix('U', U);
  printMatrix('P', PMatrix);
  console.log('Розв’язок:');
  x.forEach((v, i) => console.log(`x${i + 1} = ${fmt(v)}`));
}

main().catch(e => {
  rl.close();
  console.error('Помилка: ' + e.message);
});
