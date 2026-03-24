class Student {
  constructor(lastName, firstName, group, studentId) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.group = group;
    this.studentId = studentId;
  }
}

function displayTable(arr, title) {
  console.log(`\n--- ${title} ---`);
  console.log("#   | Прізвище    | Ім'я        | Група  | Квиток");
  console.log("-".repeat(60));
  arr.forEach((s, i) => {
    const n = String(i + 1).padEnd(3);
    const ln = s.lastName.padEnd(11);
    const fn = s.firstName.padEnd(11);
    const gr = String(s.group).padEnd(6);
    console.log(`${n} | ${ln} | ${fn} | ${gr} | ${s.studentId}`);
  });
  console.log("-".repeat(60) + "\n");
}

function compare(a, b) {
  if (a.group !== b.group) return a.group - b.group;
  return a.studentId - b.studentId;
}

function shellSortShell(arr) {
  const n = arr.length;
  let h = Math.floor(n / 2);

  const steps = [];
  let t = Math.floor(n / 2);
  while (t >= 1) { steps.push(t); t = Math.floor(t / 2); }
  console.log(`  Послідовність кроків Шелла (n=${n}): ${steps.join(" -> ")}\n`);

  while (h >= 1) {
    for (let i = h; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= h && compare(arr[j - h], temp) > 0) {
        arr[j] = arr[j - h];
        j -= h;
      }
      arr[j] = temp;
    }

    const state = arr.map(s => `${s.lastName}(${s.group}/${s.studentId})`).join("  ");
    console.log(`  [h=${String(h).padEnd(2)}] ${state}`);

    h = Math.floor(h / 2);
  }
  console.log();
}

const students = [
  new Student("Іваненко",  "Олег",    103, 1050),
  new Student("Петренко",  "Марія",   101,  730),
  new Student("Сидоренко", "Андрій",  105, 1320),
  new Student("Коваль",    "Ірина",   102,  540),
  new Student("Бойко",     "Василь",  104,  890),
  new Student("Мельник",   "Оксана",  101, 1600),
  new Student("Харченко",  "Дмитро",  106,  310),
  new Student("Левченко",  "Наталія", 103, 1750),
  new Student("Ткаченко",  "Роман",   102,  670),
  new Student("Захаренко", "Юлія",    105, 1100),
];

displayTable(students, "МАСИВ ДО СОРТУВАННЯ");
console.log("=== Сортування Шелла (Shell) — група ↑, квиток ↑ ===\n");
shellSortShell(students);
displayTable(students, "МАСИВ ПІСЛЯ СОРТУВАННЯ (група ↑, квиток ↑)");
