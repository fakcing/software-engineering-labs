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

type AnimalType = "cat" | "parrot" | "snake";

function createAnimal(type: AnimalType, name: string, hours: number) {
  switch (type) {
    case "cat":    return new Cat(name, hours);
    case "parrot": return new Parrot(name, hours);
    case "snake":  return new Snake(name, hours);
  }
}

type ActionDef = { label: string; run: () => void };

function buildActions(
  type: AnimalType,
  animal: ReturnType<typeof createAnimal>,
  owner: Owner,
  sim: TimeSimulator
): Record<string, ActionDef> {
  const actions: Record<string, ActionDef> = {
    "1": { label: "Нагодувати",   run: () => { owner.feed(); } },
    "2": { label: "Прибрати",     run: () => { owner.cleanUp(); } },
    "3": { label: "+1 година",    run: () => { sim.advance(1); } },
    "4": { label: "+8 годин",     run: () => { sim.advance(8); } },
    "5": { label: "+24 години",   run: () => { sim.advance(24); } },
    "6": { label: "Стан тварини", run: () => { console.log(`\n  ${animal}`); } },
  };

  let idx = 7;

  if (type === "cat" || type === "parrot") {
    actions[String(idx++)] = { label: "Ходити", run: () => tryAction("Ходити", () => (animal as Cat | Parrot).walk()) };
  }
  if (type === "cat") {
    actions[String(idx++)] = { label: "Бігти",  run: () => tryAction("Бігти",  () => (animal as Cat).run()) };
  }
  if (type === "parrot") {
    actions[String(idx++)] = { label: "Літати", run: () => tryAction("Літати", () => (animal as Parrot).fly()) };
  }
  if (type === "snake") {
    actions[String(idx++)] = { label: "Повзти", run: () => tryAction("Повзти", () => (animal as Snake).crawl()) };
  }
  actions[String(idx++)] = { label: "Говорити / звук", run: () => tryAction("Говорити", () => animal.talk()) };

  return actions;
}

function runInteractive(rl: readline.Interface): void {
  section("ІНТЕРАКТИВНИЙ РЕЖИМ");

  const animalTypes: Record<string, { label: string; type: AnimalType }> = {
    "1": { label: "Кіт",    type: "cat" },
    "2": { label: "Папуга", type: "parrot" },
    "3": { label: "Змія",   type: "snake" },
  };

  console.log("\n  Оберіть тварину:");
  for (const [k, v] of Object.entries(animalTypes)) {
    console.log(`    ${k}. ${v.label}`);
  }

  rl.question("\nВаш вибір: ", (typeChoice) => {
    const picked = animalTypes[typeChoice.trim()];
    if (!picked) {
      console.log("  Невідомий тип. Повернення до меню.");
      prompt();
      return;
    }

    rl.question(`  Ім'я ${picked.label.toLowerCase()}а: `, (name) => {
      const animalName = name.trim() || picked.label;
      const sim = new TimeSimulator(0);
      const animal = createAnimal(picked.type, animalName, sim.nowHours);
      const owner = new Owner("Ви", animal);
      sim.register(animal);

      console.log(`\n  Створено: ${animal}. Час: ${sim.timestamp}`);

      const actions = buildActions(picked.type, animal, owner, sim);

      function actionLoop(): void {
        console.log("\n" + "-".repeat(60));
        console.log(`  ${sim.timestamp} | ${animal}`);
        console.log("-".repeat(60));
        for (const [k, v] of Object.entries(actions)) {
          console.log(`  ${k}. ${v.label}`);
        }
        console.log("  q. Назад до головного меню");

        rl.question("\nДія: ", (ans) => {
          const a = ans.trim().toLowerCase();
          if (a === "q") {
            owner.dispose();
            sim.unregister(animal);
            prompt();
            return;
          }
          const action = actions[a];
          if (action) {
            action.run();
          } else {
            console.log(`  Невідома дія: "${a}"`);
          }
          actionLoop();
        });
      }

      actionLoop();
    });
  });
}

const scenarios: Record<string, { label: string; run: () => void }> = {
  "1": { label: "Кіт 'Барсик' з хазяйкою Оленою",        run: runScenario1 },
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
  console.log("  4. Інтерактивний режим");
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

    if (choice === "4") {
      runInteractive(rl);
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
