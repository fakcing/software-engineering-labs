const A = 0.6180339887;

class Square {
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  }

  area() {
    return parseFloat((this.side ** 2).toFixed(4));
  }

  perimeter() {
    return parseFloat((4 * this.side).toFixed(4));
  }

  toString() {
    return `Square(x=${this.x.toFixed(2)}, y=${this.y.toFixed(2)}, side=${this.side.toFixed(2)}, area=${this.area()}, perimeter=${this.perimeter()})`;
  }
}

class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null);
  }

  hash(key) {
    const frac = (key * A) % 1;
    return Math.floor(this.size * frac);
  }

  insert(square) {
    const key = square.area();
    const pos = this.hash(key);

    if (this.table[pos] !== null) {
      console.log(`  [!] Позиція ${pos} зайнята. Елемент не додано: ${square.toString()}`);
      return false;
    }

    this.table[pos] = square;
    console.log(`  [+] Додано на позицію ${pos}: ${square.toString()}`);
    return true;
  }

  display() {
    console.log("\n--- ХЕШ-ТАБЛИЦЯ (Рівень 1) ---");
    console.log("Поз | Ключ     | Елемент");
    console.log("-".repeat(70));

    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item === null) {
        console.log(`${String(i).padEnd(3)} | ${"-".padEnd(8)} | [порожньо]`);
      } else {
        const key = String(item.area()).padEnd(8);
        console.log(`${String(i).padEnd(3)} | ${key} | ${item.toString()}`);
      }
    }

    console.log("-".repeat(70) + "\n");
  }
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function generateUniqueSquares(count, tableSize) {
  const squares = [];
  const usedPositions = new Set();
  const A_CONST = 0.6180339887;

  let attempts = 0;
  while (squares.length < count && attempts < 10000) {
    attempts++;
    const side = parseFloat(randomFloat(1, 20).toFixed(2));
    const x = parseFloat(randomFloat(0, 10).toFixed(2));
    const y = parseFloat(randomFloat(0, 10).toFixed(2));
    const sq = new Square(x, y, side);
    const key = sq.area();
    const pos = Math.floor(tableSize * ((key * A_CONST) % 1));

    if (!usedPositions.has(pos)) {
      usedPositions.add(pos);
      squares.push(sq);
    }
  }

  return squares;
}


const TABLE_SIZE = 10;
const ht = new HashTable(TABLE_SIZE);

console.log("=== Генерація елементів без колізій ===\n");
const squares = generateUniqueSquares(6, TABLE_SIZE);

squares.forEach(sq => ht.insert(sq));

ht.display();
