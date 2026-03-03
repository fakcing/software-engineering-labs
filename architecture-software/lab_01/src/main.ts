import * as readline from "readline";
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

function runScenario1(): void {
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
}

function runScenario2(): void {
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
}

function runScenario3(): void {
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
}

const scenarios: Record<string, { label: string; run: () => void }> = {
  "1": { label: "Кіт 'Барсик' з хазяйкою Оленою", run: runScenario1 },
  "2": { label: "Дикий папуга 'Кеша' - смерть від голоду", run: runScenario2 },
  "3": { label: "Змія 'Нага' - щастя та відписка від подій", run: runScenario3 },
};

function printMenu(): void {
  console.log("\n" + "=".repeat(60));
  console.log("  МЕНЮ СЦЕНАРІЇВ");
  console.log("=".repeat(60));
  for (const [key, { label }] of Object.entries(scenarios)) {
    console.log(`  ${key}. ${label}`);
  }
  console.log("  q. Вийти");
  console.log("=".repeat(60));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(): void {
  printMenu();
  rl.question("\nВаш вибір: ", (answer) => {
    const choice = answer.trim().toLowerCase();

    if (choice === "q") {
      console.log("\nДо побачення!");
      rl.close();
      return;
    }

    const scenario = scenarios[choice];
    if (scenario) {
      scenario.run();
    } else {
      console.log(`\n  Невідомий вибір: "${choice}". Спробуйте ще раз.`);
    }

    prompt();
  });
}

prompt();
