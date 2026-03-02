class StackNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedStack {
  constructor() {
    this.top = null;
  }

  isEmpty() {
    return this.top === null;
  }

  push(value) {
    const node = new StackNode(value);
    node.next = this.top;
    this.top = node;
    return true;
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Стек порожній");
    }
    const value = this.top.data;
    this.top = this.top.next;
    return value;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Стек порожній");
    }
    return this.top.data;
  }

  print() {
    if (this.isEmpty()) {
      console.log("Стек: [ порожній ]");
      return;
    }
    let current = this.top;
    const items = [];
    while (current !== null) {
      items.push(current.data);
      current = current.next;
    }
    console.log("Стек (вершина -> дно): [ " + items.join(" -> ") + " ]");
  }
}

function main() {
  console.log("Рівень 2: Стек (зв'язний спосіб)\n");

  const stack = new LinkedStack();

  const values = [10, 25, 7, 42, 3, 88];
  console.log("Додаємо елементи (push): " + values.join(", "));
  for (let i = 0; i < values.length; i++) {
    stack.push(values[i]);
  }
  stack.print();

  console.log("\nВершина стеку (peek): " + stack.peek());

  console.log("\nВидаляємо 3 елементи (pop):");
  for (let i = 0; i < 3; i++) {
    console.log("  Видалено: " + stack.pop());
  }
  stack.print();

  console.log("\nДодаємо ще елементи: 99, 15");
  stack.push(99);
  stack.push(15);
  stack.print();
}

main();

module.exports = { StackNode, LinkedStack };
