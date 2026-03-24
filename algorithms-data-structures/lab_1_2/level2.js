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

const DELETED = Symbol("DELETED");

class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null);
    this.count = 0;
  }

  hash(key) {
    const frac = (key * A) % 1;
    return Math.floor(this.size * frac);
  }

  probe(basePos, i) {
    return (basePos + i + i * i) % this.size;
  }

  insert(square) {
    if (this.count >= this.size) {
      console.log("  [!] Хеш-таблиця повна. Елемент не додано.");
      return false;
    }

    const key = square.area();
    const basePos = this.hash(key);
    let i = 0;

    while (i < this.size) {
      const pos = this.probe(basePos, i);

      if (this.table[pos] === null || this.table[pos] === DELETED) {
        if (i === 0) {
          console.log(`  [+] Додано на позицію ${pos} (без колізії): ${square.toString()}`);
        } else {
          console.log(`  [+] Колізія! Квадратичне зондування: крок ${i} -> позиція ${pos}: ${square.toString()}`);
        }
        this.table[pos] = square;
        this.count++;
        return true;
      }

      i++;
    }

    console.log(`  [!] Колізія не вирішена для: ${square.toString()}`);
    return false;
  }

  display() {
    console.log("\n--- ХЕШ-ТАБЛИЦЯ (Рівень 2 - Квадратичне зондування) ---");
    console.log("Поз | Ключ     | Елемент");
    console.log("-".repeat(70));

    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item === null) {
        console.log(`${String(i).padEnd(3)} | ${"-".padEnd(8)} | [порожньо]`);
      } else if (item === DELETED) {
        console.log(`${String(i).padEnd(3)} | ${"-".padEnd(8)} | [видалено]`);
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

function generateSquares(count) {
  return Array.from({ length: count }, () => {
    const side = parseFloat(randomFloat(1, 10).toFixed(2));
    const x = parseFloat(randomFloat(0, 10).toFixed(2));
    const y = parseFloat(randomFloat(0, 10).toFixed(2));
    return new Square(x, y, side);
  });
}

const TABLE_SIZE = 10;
const ht = new HashTable(TABLE_SIZE);

console.log("=== Вставка елементів з вирішенням колізій (квадратичне зондування) ===\n");

const squares = generateSquares(7);
squares.forEach(sq => ht.insert(sq));

ht.display();
