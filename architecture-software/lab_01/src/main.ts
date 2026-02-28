import { Cat } from "./models/Cat";
import { Parrot } from "./models/Parrot";
import { Snake } from "./models/Snake";
import { Owner } from "./care/Owner";
import { WildLife } from "./care/WildLife";
import { TimeSimulator } from "./simulation/TimeSimulator";

function tryAction(label: string, action: () => void): void {
  try {
    action();
    console.log(`  ${label} - OK`);
  } catch (e: unknown) {
    console.log(`  ${label} - ЗАБЛОКОВАНО: ${(e as Error).message}`);
  }
}

function section(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

// Сценарій 1: Кіт з хазяйкою
section("СЦЕНАРІЙ 1: Кіт 'Барсик' з хазяйкою Оленою");

const sim1 = new TimeSimulator(0);
const barsyk = new Cat("Барсик", sim1.nowHours);
const olena = new Owner("Олена", barsyk);
sim1.register(barsyk);

olena.feed();
olena.cleanUp();

tryAction("Барсик ходить", () => barsyk.walk());
tryAction("Барсик біжить (щойно поїв)", () => barsyk.run());

sim1.advance(9);

tryAction("Барсик ходить (голодний)", () => barsyk.walk());
tryAction("Барсик біжить (голодний)", () => barsyk.run());
tryAction("Барсик нявкає (голодний)", () => barsyk.talk());

console.log("  Олена годує Барсика...");
olena.feed();
tryAction("Барсик біжить (після їжі)", () => barsyk.run());

sim1.advance(5); olena.feed();
sim1.advance(5); olena.feed();
sim1.advance(5); olena.feed();
sim1.advance(5); olena.feed();

const refused = !olena.feed();
console.log(`  Спроба годувати при максимумі (5/5): відмовлено - ${refused}`);

olena.cleanUp();
console.log(`\n  Стан: ${barsyk}`);
olena.dispose();
sim1.unregister(barsyk);

// Сценарій 2: Дикий папуга
section("СЦЕНАРІЙ 2: Дикий папуга 'Кеша' - смерть від голоду");

const sim2 = new TimeSimulator(0);
const kesha = new Parrot("Кеша", sim2.nowHours);
const wildKesha = new WildLife(kesha);
sim2.register(kesha);

tryAction("Кеша літає", () => kesha.fly());
tryAction("Кеша ходить", () => kesha.walk());
tryAction("Кеша говорить", () => kesha.talk());

sim2.advance(9);

tryAction("Кеша літає (голодний)", () => kesha.fly());
tryAction("Кеша ходить (голодний)", () => kesha.walk());
tryAction("Кеша говорить (голодний)", () => kesha.talk());

sim2.advance(16);

tryAction("Кеша літає (мертвий)", () => kesha.fly());
tryAction("Кеша говорить (мертвий)", () => kesha.talk());
console.log(`\n  Стан: ${kesha}`);
wildKesha.dispose();
sim2.unregister(kesha);

// Сценарій 3: Змія, щастя та відписка від подій
section("СЦЕНАРІЙ 3: Змія 'Нага' - щастя та відписка від подій");

const sim3 = new TimeSimulator(0);
const naga = new Snake("Нага", sim3.nowHours);
const ivan = new Owner("Іван", naga);
sim3.register(naga);

ivan.feed();
tryAction("Нага повзе", () => naga.crawl());
tryAction("Нага шипить", () => naga.talk());
tryAction("Нага біжить (змія не вміє бігати)", () => (naga as any).run());

console.log(`  Нага щаслива (без прибирання): ${naga.isHappy}`);
ivan.cleanUp();
console.log(`  Нага щаслива після прибирання: ${naga.isHappy}`);
ivan.cleanUp();
console.log(`  Прибирань сьогодні: ${naga.cleansToday}`);

sim3.advance(5);
ivan.feed();
sim3.advance(20);
ivan.feed();

console.log(`  Нага щаслива після нового дня (ще не прибирали): ${naga.isHappy}`);
ivan.cleanUp();
console.log(`  Нага щаслива після прибирання на день 2: ${naga.isHappy}`);

console.log("\n  Іван відписується від сповіщень");
ivan.dispose();

sim3.advance(9);
console.log(`  (Сповіщень немає - Іван відписався)`);
console.log(`  Нага голодна: ${naga.isHungry}`);
ivan.feed();
console.log(`\n  Стан: ${naga}`);
sim3.unregister(naga);

section("ПІДСУМОК");
console.log(`  ${barsyk}`);
console.log(`  ${kesha}`);
console.log(`  ${naga}`);
