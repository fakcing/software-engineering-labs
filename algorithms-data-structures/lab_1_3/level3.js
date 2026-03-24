class Student {
  constructor(lastName, firstName, course, studentId, gender, residence) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.course = course;
    this.studentId = studentId;
    this.gender = gender;
    this.residence = residence;
  }

  toString() {
    return `${this.lastName} ${this.firstName} | курс:${this.course} | квиток:${this.studentId} | ${this.gender} | ${this.residence}`;
  }

  matchesCriteria() {
    return this.gender === "М" && this.course === 3 && this.residence === "гуртожиток";
  }
}

class TreeNode {
  constructor(student) {
    this.data = student;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(student) {
    const node = new TreeNode(student);
    if (!this.root) { this.root = node; return true; }
    let cur = this.root;
    while (true) {
      if (student.studentId === cur.data.studentId) {
        console.log(`  [!] Дублікат ключа ${student.studentId} — не додано.`);
        return false;
      }
      if (student.studentId < cur.data.studentId) {
        if (!cur.left) { cur.left = node; return true; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; return true; }
        cur = cur.right;
      }
    }
  }

  bfsTraversal() {
    if (!this.root) return [];
    const result = [], queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  _deleteNode(root, id) {
    if (!root) return null;

    if (id < root.data.studentId) {
      root.left = this._deleteNode(root.left, id);
    } else if (id > root.data.studentId) {
      root.right = this._deleteNode(root.right, id);
    } else {
      if (!root.left && !root.right) {
        console.log(`  [-] Видалено (листок): ${root.data.toString()}`);
        return null;
      } else if (!root.left) {
        console.log(`  [-] Видалено (один нащадок): ${root.data.toString()}`);
        return root.right;
      } else if (!root.right) {
        console.log(`  [-] Видалено (один нащадок): ${root.data.toString()}`);
        return root.left;
      } else {
        console.log(`  [-] Видалено (два нащадки): ${root.data.toString()}`);
        let minNode = root.right;
        while (minNode.left) minNode = minNode.left;
        root.data = minNode.data;
        root.right = this._deleteNode(root.right, minNode.data.studentId);
      }
    }
    return root;
  }

  deleteByCriteria() {
    const toDelete = [];
    this._collectForDeletion(this.root, toDelete);

    if (toDelete.length === 0) {
      console.log("  [i] Вузлів за критерієм не знайдено.\n");
      return;
    }

    console.log(`  [i] Знайдено для видалення: ${toDelete.length} вузол(ів)\n`);
    toDelete.forEach(id => {
      this.root = this._deleteNode(this.root, id);
    });
  }

  _collectForDeletion(node, arr) {
    if (!node) return;
    if (node.data.matchesCriteria()) arr.push(node.data.studentId);
    this._collectForDeletion(node.left, arr);
    this._collectForDeletion(node.right, arr);
  }

  display(title = "БІНАРНЕ ДЕРЕВО (обхід у ширину - BFS)", nodes = null) {
    const data = nodes ?? this.bfsTraversal();
    if (data.length === 0) { console.log("  [i] Дерево порожнє.\n"); return; }

    console.log(`\n--- ${title} ---`);
    console.log("#   | Квиток | Прізвище    | Ім'я        | Курс | Стать | Місце проживання");
    console.log("-".repeat(75));

    data.forEach((s, i) => {
      const n = String(i + 1).padEnd(3);
      const id = String(s.studentId).padEnd(6);
      const ln = s.lastName.padEnd(11);
      const fn = s.firstName.padEnd(11);
      const cr = String(s.course).padEnd(4);
      const gn = s.gender.padEnd(5);
      console.log(`${n} | ${id} | ${ln} | ${fn} | ${cr} | ${gn} | ${s.residence}`);
    });

    console.log("-".repeat(75) + "\n");
  }
}

const students = [
  new Student("Іваненко",  "Олег",    2, 1050, "М", "місто"),
  new Student("Петренко",  "Марія",   3,  730, "Ж", "місто"),
  new Student("Сидоренко", "Андрій",  3, 1320, "М", "гуртожиток"),
  new Student("Коваль",    "Ірина",   1,  540, "Ж", "гуртожиток"),
  new Student("Бойко",     "Василь",  3,  890, "М", "гуртожиток"),
  new Student("Мельник",   "Оксана",  4, 1600, "Ж", "місто"),
  new Student("Ткаченко",  "Роман",   3,  670, "М", "гуртожиток"),
  new Student("Захаренко", "Юлія",    1, 1100, "Ж", "місто"),
  new Student("Гриценко",  "Павло",   3,  980, "М", "гуртожиток"),
  new Student("Левченко",  "Наталія", 3, 1750, "Ж", "гуртожиток"),
];

const tree = new BinaryTree();

console.log("=== Додавання елементів до дерева ===\n");
students.forEach(s => {
  const ok = tree.insert(s);
  if (ok) console.log(`  [+] Додано: ${s.toString()}`);
});

tree.display("ДЕРЕВО ДО ВИДАЛЕННЯ (BFS)");

console.log("=== Видалення: студенти-чоловіки 3-го курсу, що проживають у гуртожитку ===\n");
tree.deleteByCriteria();

tree.display("ДЕРЕВО ПІСЛЯ ВИДАЛЕННЯ (BFS)");
