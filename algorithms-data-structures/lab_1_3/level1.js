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
    if (this.root === null) {
      this.root = node;
      return true;
    }
    let current = this.root;
    while (true) {
      if (student.studentId === current.data.studentId) {
        console.log(`  [!] Дублікат ключа ${student.studentId} — елемент не додано.`);
        return false;
      }
      if (student.studentId < current.data.studentId) {
        if (current.left === null) { current.left = node; return true; }
        current = current.left;
      } else {
        if (current.right === null) { current.right = node; return true; }
        current = current.right;
      }
    }
  }

  bfsTraversal() {
    if (!this.root) return [];
    const result = [];
    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  display(title = "БІНАРНЕ ДЕРЕВО (обхід у ширину - BFS)") {
    const nodes = this.bfsTraversal();
    if (nodes.length === 0) { console.log("  [i] Дерево порожнє.\n"); return; }

    console.log(`\n--- ${title} ---`);
    console.log("#   | Квиток | Прізвище    | Ім'я        | Курс | Стать | Місце проживання");
    console.log("-".repeat(75));

    nodes.forEach((s, i) => {
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
  new Student("Іваненко",  "Олег",    2, 1050, "М", "гуртожиток"),
  new Student("Петренко",  "Марія",   3,  730, "Ж", "місто"),
  new Student("Сидоренко", "Андрій",  3, 1320, "М", "гуртожиток"),
  new Student("Коваль",    "Ірина",   1,  540, "Ж", "гуртожиток"),
  new Student("Бойко",     "Василь",  3,  890, "М", "гуртожиток"),
  new Student("Мельник",   "Оксана",  4, 1600, "Ж", "місто"),
  new Student("Харченко",  "Дмитро",  2,  310, "М", "місто"),
  new Student("Левченко",  "Наталія", 3, 1750, "Ж", "гуртожиток"),
  new Student("Ткаченко",  "Роман",   3,  670, "М", "гуртожиток"),
  new Student("Захаренко", "Юлія",    1, 1100, "Ж", "місто"),
];

const tree = new BinaryTree();

console.log("=== Додавання елементів до дерева ===\n");
students.forEach(s => {
  const ok = tree.insert(s);
  if (ok) console.log(`  [+] Додано: ${s.toString()}`);
});

tree.display();
