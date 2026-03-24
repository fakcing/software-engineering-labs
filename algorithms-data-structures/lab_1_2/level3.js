const A = 0.6180339887;
const DELETED = Symbol("DELETED");

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
      console.log("  [!] Хеш-таблиця повна.");
      return false;
    }

    const key = square.area();
    const basePos = this.hash(key);
    let i = 0;

    while (i < this.size) {
      const pos = this.probe(basePos, i);

      if (this.table[pos] === null || this.table[pos] === DELETED) {
        if (i === 0) {
          console.log(`  [+] Позиція ${pos}: ${square.toString()}`);
        } else {
          console.log(`  [+] Колізія -> крок ${i} -> позиція ${pos}: ${square.toString()}`);
        }
        this.table[pos] = square;
        this.count++;
        return true;
      }

      i++;
    }

    console.log(`  [!] Колізія не вирішена: ${square.toString()}`);
    return false;
  }

  deleteByPerimeter(threshold) {
    let removed = 0;

    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item !== null && item !== DELETED) {
        if (item.perimeter() > threshold) {
          console.log(`  [-] Видалено з позиції ${i} (perimeter=${item.perimeter()} > ${threshold}): ${item.toString()}`);
          this.table[i] = DELETED;
          this.count--;
          removed++;
        }
      }
    }

    if (removed === 0) {
      console.log(`  [i] Елементів з периметром > ${threshold} не знайдено.`);
    } else {
      console.log(`  [i] Видалено елементів: ${removed}`);
    }
  }

  display(title = "ХЕШ-ТАБЛИЦЯ") {
    console.log(`\n--- ${title} ---`);
    console.log("Поз | Ключ     | Елемент");
    console.log("-".repeat(70));

    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      const posStr = String(i).padEnd(3);

      if (item === null) {
        console.log(`${posStr} | ${"-".padEnd(8)} | [порожньо]`);
      } else if (item === DELETED) {
        console.log(`${posStr} | ${"-".padEnd(8)} | [видалено]`);
      } else {
        const key = String(item.area()).padEnd(8);
        console.log(`${posStr} | ${key} | ${item.toString()}`);
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
    const side = parseFloat(randomFloat(1, 12).toFixed(2));
    const x = parseFloat(randomFloat(0, 10).toFixed(2));
    const y = parseFloat(randomFloat(0, 10).toFixed(2));
    return new Square(x, y, side);
  });
}

const TABLE_SIZE = 11;
const ht = new HashTable(TABLE_SIZE);

console.log("=== Вставка елементів (квадратичне зондування) ===\n");
const squares = generateSquares(8);
squares.forEach(sq => ht.insert(sq));

ht.display("ХЕШ-ТАБЛИЦЯ (до видалення)");

const PERIMETER_THRESHOLD = 20;
console.log(`=== Видалення елементів з периметром > ${PERIMETER_THRESHOLD} ===\n`);
ht.deleteByPerimeter(PERIMETER_THRESHOLD);

ht.display("ХЕШ-ТАБЛИЦЯ (після видалення)");
