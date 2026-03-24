class Student {
  constructor(lastName, firstName, group, gender, recordBookId) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.group = group;
    this.gender = gender;
    this.recordBookId = recordBookId;
  }

  toString() {
    return `${this.lastName} ${this.firstName} | ${this.gender} | гр.${this.group} | №${this.recordBookId}`;
  }
}

class TreeNode {
  constructor(student) {
    this.data = student;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  _rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  _rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    x.right = y;
    return x;
  }

  _insertRoot(node, student) {
    if (!node) return new TreeNode(student);

    if (student.recordBookId < node.data.recordBookId) {
      node.left = this._insertRoot(node.left, student);
      node = this._rotateRight(node);
    } else if (student.recordBookId > node.data.recordBookId) {
      node.right = this._insertRoot(node.right, student);
      node = this._rotateLeft(node);
    }
    return node;
  }

  insert(student) {
    this.root = this._insertRoot(this.root, student);
  }

  search(id) {
    let cur = this.root;
    while (cur) {
      if      (id === cur.data.recordBookId) return cur.data;
      else if (id <  cur.data.recordBookId)  cur = cur.left;
      else                                    cur = cur.right;
    }
    return null;
  }

  bfsTraversal() {
    if (!this.root) return [];
    const result = [], queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node.data);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  display(title = "BST (BFS)") {
    const nodes = this.bfsTraversal();
    if (!nodes.length) { console.log("  [порожнє]\n"); return; }

    console.log(`\n--- ${title} ---`);
    console.log("#   | №залікової   | Прізвище    | Ім'я        | Група  | Стать");
    console.log("-".repeat(70));
    nodes.forEach((s, i) => {
      const n = String(i + 1).padEnd(3);
      const id = String(s.recordBookId).padEnd(12);
      const ln = s.lastName.padEnd(11);
      const fn = s.firstName.padEnd(11);
      const gr = String(s.group).padEnd(6);
      console.log(`${n} | ${id} | ${ln} | ${fn} | ${gr} | ${s.gender}`);
    });
    console.log("-".repeat(70) + "\n");
  }
}

const students = [
  new Student("Іваненко",  "Олег",    103, "М", 1050),
  new Student("Петренко",  "Марія",   101, "Ж",  730),
  new Student("Сидоренко", "Андрій",  105, "М", 1320),
  new Student("Коваль",    "Ірина",   102, "Ж",  540),
  new Student("Бойко",     "Василь",  104, "М",  890),
  new Student("Мельник",   "Оксана",  101, "Ж", 1600),
  new Student("Харченко",  "Дмитро",  106, "М",  310),
];

const bst = new BST();

console.log("=== Побудова BST (вставка у корінь через ротації) ===\n");
students.forEach(s => {
  console.log(`  [+] Вставляємо: ${s.toString()}`);
  bst.insert(s);
  bst.display(`Після вставки №${s.recordBookId}`);
});

const TARGET = 890;
console.log(`=== Пошук за №залікової = ${TARGET} ===\n`);
const found = bst.search(TARGET);
if (found) {
  console.log(`  [+] Знайдено: ${found.toString()}\n`);
} else {
  console.log(`  [-] Не знайдено.\n`);
}

const MISSING = 9999;
console.log(`=== Пошук за №залікової = ${MISSING} ===\n`);
const found2 = bst.search(MISSING);
if (found2) {
  console.log(`  [+] Знайдено: ${found2.toString()}\n`);
} else {
  console.log(`  [-] Не знайдено.\n`);
}
