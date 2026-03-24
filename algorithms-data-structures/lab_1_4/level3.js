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

function merge(arr, aux, lo, mid, hi) {
  for (let k = lo; k <= hi; k++) aux[k] = arr[k];

  let i = lo;
  let j = mid + 1;

  for (let k = lo; k <= hi; k++) {
    if      (i > mid)                     arr[k] = aux[j++];
    else if (j > hi)                      arr[k] = aux[i++];
    else if (aux[j].group < aux[i].group) arr[k] = aux[j++];
    else                                  arr[k] = aux[i++];
  }
}

function mergeSortBottomUp(arr) {
  const n = arr.length;
  const aux = new Array(n);

  for (let size = 1; size < n; size *= 2) {
    console.log(`  [розмір блоку = ${size}]`);

    for (let lo = 0; lo < n - size; lo += size * 2) {
      const mid = lo + size - 1;
      const hi = Math.min(lo + size * 2 - 1, n - 1);
      merge(arr, aux, lo, mid, hi);
    }

    const state = arr.map(s => `${s.lastName}(${s.group})`).join("  ");
    console.log(`    ${state}\n`);
  }
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
console.log("=== Висхідне сортування злиттям — за зростанням номера групи ===\n");
mergeSortBottomUp(students);
displayTable(students, "МАСИВ ПІСЛЯ СОРТУВАННЯ");
