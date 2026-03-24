class Student {
  constructor(lastName, firstName, group, gender, recordBookId) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.group = group;
    this.gender = gender;
    this.recordBookId = recordBookId;
  }

  genderCode() { return this.gender === 'М' ? 0 : 1; }
}

function displayTable(arr, title) {
  console.log(`\n--- ${title} ---`);
  console.log("#   | Прізвище    | Ім'я        | Група  | Стать | №залікової");
  console.log("-".repeat(65));
  arr.forEach((s, i) => {
    const n = String(i + 1).padEnd(3);
    const ln = s.lastName.padEnd(11);
    const fn = s.firstName.padEnd(11);
    const gr = String(s.group).padEnd(6);
    const gn = s.gender.padEnd(5);
    console.log(`${n} | ${ln} | ${fn} | ${gr} | ${gn} | ${s.recordBookId}`);
  });
  console.log("-".repeat(65) + "\n");
}

function insertSorted(arr, student) {
  let pos = arr.length;
  for (let i = 0; i < arr.length; i++) {
    if (student.genderCode() < arr[i].genderCode() ||
       (student.genderCode() === arr[i].genderCode() &&
        student.recordBookId < arr[i].recordBookId)) {
      pos = i;
      break;
    }
  }
  arr.splice(pos, 0, student);
}

function interpolationSearch(arr, targetId) {
  const males = arr.filter(s => s.gender === 'М');

  if (males.length === 0) return null;

  let lo = 0;
  let hi = males.length - 1;
  let steps = 0;

  while (lo <= hi &&
         targetId >= males[lo].recordBookId &&
         targetId <= males[hi].recordBookId) {
    steps++;

    if (males[lo].recordBookId === males[hi].recordBookId) {
      if (males[lo].recordBookId === targetId) {
        console.log(`  [крок ${steps}] lo=hi=${lo}, знайдено одразу`);
        return males[lo];
      }
      break;
    }

    const pos = lo + Math.floor(
      ((targetId - males[lo].recordBookId) * (hi - lo)) /
      (males[hi].recordBookId - males[lo].recordBookId)
    );

    console.log(`  [крок ${steps}] lo=${lo}, hi=${hi}, pos=${pos}, перевіряємо №${males[pos].recordBookId} (${males[pos].lastName})`);

    if (males[pos].recordBookId === targetId) {
      return males[pos];
    } else if (males[pos].recordBookId < targetId) {
      lo = pos + 1;
    } else {
      hi = pos - 1;
    }
  }

  console.log(`  [крок ${steps + 1}] елемент не знайдено в діапазоні`);
  return null;
}

const rawStudents = [
  new Student("Іваненко",  "Олег",     103, "М", 1001),
  new Student("Петренко",  "Марія",    101, "Ж", 1002),
  new Student("Сидоренко", "Андрій",   105, "М", 1003),
  new Student("Коваль",    "Ірина",    102, "Ж", 1004),
  new Student("Бойко",     "Василь",   104, "М", 1005),
  new Student("Мельник",   "Оксана",   101, "Ж", 1006),
  new Student("Харченко",  "Дмитро",   106, "М", 1007),
  new Student("Левченко",  "Наталія",  103, "Ж", 1008),
  new Student("Ткаченко",  "Роман",    102, "М", 1009),
  new Student("Захаренко", "Юлія",     105, "Ж", 1010),
  new Student("Гриценко",  "Павло",    104, "М", 1011),
  new Student("Шевченко",  "Тетяна",   101, "Ж", 1012),
  new Student("Кравченко", "Микола",   103, "М", 1013),
  new Student("Морозенко", "Олена",    106, "Ж", 1014),
  new Student("Дяченко",   "Сергій",   102, "М", 1015),
  new Student("Лисенко",   "Вікторія", 104, "Ж", 1016),
  new Student("Павленко",  "Ігор",     105, "М", 1017),
  new Student("Волошин",   "Христина", 101, "Ж", 1018),
  new Student("Гончаренко","Олексій",  103, "М", 1019),
  new Student("Яременко",  "Дарина",   102, "Ж", 1020),
];

const students = [];
rawStudents.forEach(s => insertSorted(students, s));

displayTable(students, "МАСИВ (впорядкований за статтю, потім за №залікової)");

const TARGET_ID = 1013;
console.log(`=== Інтерполяційний пошук №залікової = ${TARGET_ID} серед студентів-чоловіків ===\n`);

const result = interpolationSearch(students, TARGET_ID);

if (result) {
  console.log(`\n  [+] Знайдено: ${result.lastName} ${result.firstName} | ${result.gender} | №${result.recordBookId}`);
} else {
  console.log(`\n  [-] Студента-чоловіка з №залікової ${TARGET_ID} не знайдено.`);
}

const MISSING_ID = 1099;
console.log(`\n=== Пошук №залікової = ${MISSING_ID} (неіснуючий) ===\n`);
const result2 = interpolationSearch(students, MISSING_ID);
if (result2) {
  console.log(`\n  [+] Знайдено: ${result2.lastName} ${result2.firstName}`);
} else {
  console.log(`\n  [-] Студента-чоловіка з №залікової ${MISSING_ID} не знайдено.`);
}
