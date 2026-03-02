class ArrayList {
  constructor(capacity) {
    this.capacity = capacity;
    this.data = new Array(capacity).fill(null);
    this.size = 0;
  }

  isFull() {
    return this.size === this.capacity;
  }

  isEmpty() {
    return this.size === 0;
  }

  insert(value, index) {
    if (index === undefined) index = this.size;

    if (this.isFull()) {
      console.log("Список заповнений");
      return false;
    }

    if (index < 0 || index > this.size) {
      console.log("Некоректний індекс");
      return false;
    }

    for (let i = this.size; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }

    this.data[index] = value;
    this.size++;
    return true;
  }

  remove(index) {
    if (index === undefined) index = this.size - 1;

    if (this.isEmpty()) {
      throw new Error("Список порожній");
    }

    if (index < 0 || index >= this.size) {
      throw new Error("Некоректний індекс");
    }

    const removed = this.data[index];

    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }

    this.data[this.size - 1] = null;
    this.size--;
    return removed;
  }

  get(index) {
    return this.data[index];
  }

  print() {
    const items = this.data.slice(0, this.size);
    console.log("Список [" + this.size + " елем.]: [ " + items.join(" -> ") + " ]");
  }
}

function main() {
  console.log("Рівень 1: Список (векторний спосіб)\n");

  const list = new ArrayList(8);

  const hexValues = ["1A", "2F", "3C", "B4", "FF", "0D"];
  console.log("Вставляємо елементи: " + hexValues.join(", "));
  for (let i = 0; i < hexValues.length; i++) {
    list.insert(hexValues[i]);
  }
  list.print();

  console.log('\nВставляємо "7E" на позицію 2:');
  list.insert("7E", 2);
  list.print();

  console.log("\nВидаляємо елемент з позиції 0:");
  const r1 = list.remove(0);
  console.log("Видалено: " + r1);
  list.print();

  console.log("\nВидаляємо елемент з позиції 3:");
  const r2 = list.remove(3);
  console.log("Видалено: " + r2);
  list.print();

  console.log("\nВидаляємо останній елемент:");
  const r3 = list.remove();
  console.log("Видалено: " + r3);
  list.print();
}

main();

module.exports = { ArrayList };
