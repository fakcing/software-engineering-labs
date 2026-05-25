const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const graph = new Map([
  ['A', ['B', 'D', 'E']],
  ['B', ['A', 'C', 'F']],
  ['C', ['B', 'D', 'G']],
  ['D', ['A', 'C', 'H']],
  ['E', ['A', 'F', 'H']],
  ['F', ['B', 'E', 'G']],
  ['G', ['C', 'F', 'H']],
  ['H', ['D', 'E', 'G']]
]);

function printAdjacencyList(g) {
  console.log('Список суміжних вершин:');
  for (const [v, n] of g) console.log(`${v}: ${n.join(', ')}`);
}

function bfs(g, start) {
  if (!g.has(start)) throw new Error('Такої вершини немає');
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const v = queue.shift();
    order.push(v);
    for (const next of g.get(v)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

rl.question('Введіть початкову вершину для обходу в ширину (A-H): ', value => {
  try {
    const start = value.trim().toUpperCase() || 'A';
    printAdjacencyList(graph);
    console.log('Початкова вершина: ' + start);
    console.log('Обхід у ширину: ' + bfs(graph, start).join(' -> '));
  } catch (e) {
    console.error('Помилка: ' + e.message);
  } finally {
    rl.close();
  }
});
