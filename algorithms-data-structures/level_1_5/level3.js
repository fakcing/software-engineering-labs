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

class SplayBST {
  constructor() {
    this.root = null;
  }

  _rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    x.right = y;
    return x;
  }

  _rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  _splay(node, key) {
    if (!node) return null;
    if (key === node.data.recordBookId) return node;

    if (key < node.data.recordBookId) {
      if (!node.left) return node;

      if (key < node.left.data.recordBookId) {
        node.left.left = this._splay(node.left.left, key);
        node = this._rotateRight(node);
      } else if (key > node.left.data.recordBookId) {
        node.left.right = this._splay(node.left.right, key);
        if (node.left.right) node.left = this._rotateLeft(node.left);
      }
      return node.left ? this._rotateRight(node) : node;

    } else {
      if (!node.right) return node;

      if (key > node.right.data.recordBookId) {
        node.right.right = this._splay(node.right.right, key);
        node = this._rotateLeft(node);
      } else if (key < node.right.data.recordBookId) {
        node.right.left = this._splay(node.right.left, key);
        if (node.right.left) node.right = this._rotateRight(node.right);
      }
      return node.right ? this._rotateLeft(node) : node;
    }
  }

  insert(student) {
    const key = student.recordBookId;

    if (!this.root) {
      this.root = new TreeNode(student);
      return;
    }

    this.root = this._splay(this.root, key);

    if (this.root.data.recordBookId === key) return;

    const newNode = new TreeNode(student);

    if (key < this.root.data.recordBookId) {
      newNode.right = this.root;
      newNode.left = this.root.left;
      this.root.left = null;
    } else {
      newNode.left = this.root;
      newNode.right = this.root.right;
      this.root.right = null;
    }

    this.root = newNode;
  }

  search(key) {
    if (!this.root) return null;
    this.root = this._splay(this.root, key);
    if (this.root.data.recordBookId === key) return this.root.data;
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

  display(title = "SPLAY BST (BFS)") {
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

const tree = new SplayBST();

console.log("=== Побудова Splay Tree (амортизаційне балансування) ===\n");
students.forEach(s => {
  console.log(`  [+] Вставляємо: ${s.toString()}`);
  tree.insert(s);
  tree.display(`Після вставки №${s.recordBookId} (корінь: №${tree.root.data.recordBookId})`);
});

const TARGET = 890;
console.log(`=== Пошук №залікової = ${TARGET} (Splay підтягне до кореня) ===\n`);
const found = tree.search(TARGET);
if (found) {
  console.log(`  [+] Знайдено: ${found.toString()}`);
  tree.display(`Після пошуку №${TARGET} (корінь: №${tree.root.data.recordBookId})`);
} else {
  console.log(`  [-] Не знайдено.\n`);
}

const MISSING = 9999;
console.log(`=== Пошук №залікової = ${MISSING} ===\n`);
const found2 = tree.search(MISSING);
console.log(found2 ? `  [+] Знайдено: ${found2.toString()}` : `  [-] Не знайдено.\n`);
