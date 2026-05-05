import * as readline from 'readline';
import { Cat } from './models/Cat';
import { Parrot } from './models/Parrot';
import { Snake } from './models/Snake';
import { Animal } from './models/Animal';
import { CatFactory, ParrotFactory, SnakeFactory } from './factory/AnimalFactory';
import { IAnimalFactory } from './factory/IAnimalFactory';
import { OwnerHabitat } from './habitats/OwnerHabitat';
import { PetShopHabitat } from './habitats/PetShopHabitat';
import { WildHabitat } from './habitats/WildHabitat';
import { TimeSimulator } from './simulation/TimeSimulator';

function tryAction(label: string, action: () => void): void {
  try {
    action();
    console.log(`  ${label} - OK`);
  } catch (e: unknown) {
    console.log(`  ${label} - ЗАБЛОКОВАНО: ${(e as Error).message}`);
  }
}

function section(title: string): void {
  console.log('\n' + '='.repeat(62));
  console.log(`  ${title}`);
  console.log('='.repeat(62));
}

function runScenario1(): void {
  section("СЦЕНАРІЙ 1: Хазяїн Олена - Factory Method + Observer");

  const sim1 = new TimeSimulator(0);
  const catFactory = new CatFactory();

  const olena = new OwnerHabitat('Олена');
  const barsyk = olena.adopt(catFactory, 'Барсик', sim1.nowHours);
  sim1.register(barsyk);

  olena.feed();
  olena.cleanUp();

  const barsykCat = barsyk as Cat;
  tryAction('Барсик ходить', () => barsykCat.walk());
  tryAction('Барсик біжить (ситий)', () => barsykCat.run());
  tryAction('Барсик нявкає (ситий)', () => barsykCat.sing());

  sim1.advance(9);

  tryAction('Барсик ходить (голодний)', () => barsykCat.walk());
  tryAction('Барсик біжить (голодний)', () => barsykCat.run());
  tryAction('Барсик нявкає (голодний)', () => barsykCat.sing());

  olena.feed();
  tryAction('Барсик біжить (після їжі)', () => barsykCat.run());

  sim1.advance(5); olena.feed();
  sim1.advance(5); olena.feed();
  sim1.advance(5); olena.feed();
  sim1.advance(5); olena.feed();

  const refused = !olena.feed();
  console.log(`  Спроба при максимумі (5/5): відмовлено - ${refused}`);
  olena.cleanUp();

  console.log(`\n  Стан: ${barsyk}`);
  console.log(`\n  Олена відписується (release)...`);
  olena.release();
  sim1.unregister(barsyk);
}

function runScenario2(): void {
  section("СЦЕНАРІЙ 2: Зоомагазин 'Лапки' — кілька тварин");

  const sim2 = new TimeSimulator(0);
  const catFactory    = new CatFactory();
  const parrotFactory = new ParrotFactory();
  const snakeFactory  = new SnakeFactory();

  const shop = new PetShopHabitat('Зоомагазин Лапки');
  const kesha = shop.addAnimal(parrotFactory, 'Кеша', sim2.nowHours);
  const naga  = shop.addAnimal(snakeFactory,  'Нага', sim2.nowHours);
  const simon = shop.addAnimal(catFactory,    'Сімон', sim2.nowHours);

  sim2.register(kesha);
  sim2.register(naga);
  sim2.register(simon);

  shop.feed(kesha);
  shop.feed(naga);
  shop.feed(simon);
  shop.cleanUp(kesha);
  shop.cleanUp(naga);
  shop.cleanUp(simon);

  console.log(`  Кеша щасливий: ${kesha.isHappy}`);
  console.log(`  Нага щаслива: ${naga.isHappy}`);

  sim2.advance(9);

  const keshParrot = kesha as Parrot;
  const nagaSnake  = naga as Snake;

  tryAction('Кеша літає (голодний)',    () => keshParrot.fly());
  tryAction('Кеша ходить (голодний)',   () => keshParrot.walk());
  tryAction('Нага повзе (голодна)',     () => nagaSnake.crawl());

  shop.feed(kesha);
  shop.feed(naga);
  shop.feed(simon);

  tryAction('Кеша летить (після їжі)', () => keshParrot.fly());

  console.log('\n  Стан тварин у магазині:');
  shop.animals.forEach(a => console.log(`  ${a}`));

  sim2.advance(5);
  shop.feed(kesha);
  shop.cleanUp(simon);

  sim2.unregister(kesha);
  sim2.unregister(naga);
  sim2.unregister(simon);
}

function runScenario3(): void {
  section("СЦЕНАРІЙ 3: Дика природа — смерть від голоду");

  const sim3 = new TimeSimulator(0);
  const parrotFactory = new ParrotFactory();
  const snakeFactory  = new SnakeFactory();
  const wild = new WildHabitat();

  const wildBird  = wild.addAnimal(parrotFactory, 'Крила', sim3.nowHours);
  const wildSnake = wild.addAnimal(snakeFactory,  'Шипун', sim3.nowHours);

  sim3.register(wildBird);
  sim3.register(wildSnake);

  console.log(`  Дикі тварини завжди щасливі: крила=${wildBird.isHappy}, шипун=${wildSnake.isHappy}`);

  const wildBirdParrot = wildBird as Parrot;
  tryAction('Крила летить', () => wildBirdParrot.fly());

  sim3.advance(9);

  tryAction('Крила летить (голодна)', () => wildBirdParrot.fly());

  sim3.advance(16);

  tryAction('Крила летить (мертва)',  () => wildBirdParrot.fly());
  tryAction('Шипун повзе (живий)',    () => (wildSnake as Snake).crawl());

  console.log('\n  Стан:');
  wild.animals.forEach(a => console.log(`  ${a}`));

  sim3.unregister(wildBird);
  sim3.unregister(wildSnake);
}

function runScenario4(): void {
  section("СЦЕНАРІЙ 4: Обмеження хазяїна — тільки одна тварина");

  const catFactory   = new CatFactory();
  const snakeFactory = new SnakeFactory();

  const ivan = new OwnerHabitat('Іван');
  ivan.adopt(snakeFactory, 'Вася', 0);

  tryAction('Іван заводить другу тварину', () => ivan.adopt(catFactory, 'Мурка', 0));

  console.log(`  Тварина Івана: ${ivan.animal}`);
}

// ─── Interactive mode ────────────────────────────────────────────────────────

type AnimalType   = 'cat' | 'parrot' | 'snake';
type HabitatType  = 'owner' | 'petshop' | 'wild';

function getFactory(type: AnimalType): IAnimalFactory {
  switch (type) {
    case 'cat':    return new CatFactory();
    case 'parrot': return new ParrotFactory();
    case 'snake':  return new SnakeFactory();
  }
}

function buildInteractiveActions(
  animalType: AnimalType,
  animal: Animal,
  sim: TimeSimulator,
  feedFn: (() => void) | null,
  cleanFn: (() => void) | null,
): Record<string, { label: string; run: () => void }> {
  const actions: Record<string, { label: string; run: () => void }> = {};
  let idx = 1;

  if (feedFn) {
    actions[String(idx++)] = { label: 'Нагодувати', run: feedFn };
  }
  if (cleanFn) {
    actions[String(idx++)] = { label: 'Прибрати', run: cleanFn };
  }

  actions[String(idx++)] = { label: '+1 година',    run: () => sim.advance(1) };
  actions[String(idx++)] = { label: '+8 годин',     run: () => sim.advance(8) };
  actions[String(idx++)] = { label: '+24 години',   run: () => sim.advance(24) };
  actions[String(idx++)] = { label: 'Стан тварини', run: () => console.log(`\n  ${animal}`) };

  if (animalType === 'cat' || animalType === 'parrot') {
    actions[String(idx++)] = {
      label: 'Ходити',
      run: () => tryAction('Ходити', () => (animal as Cat | Parrot).walk()),
    };
  }
  if (animalType === 'cat') {
    actions[String(idx++)] = { label: 'Бігти',   run: () => tryAction('Бігти',   () => (animal as Cat).run()) };
    actions[String(idx++)] = { label: 'Нявкати', run: () => tryAction('Нявкати', () => (animal as Cat).sing()) };
  }
  if (animalType === 'parrot') {
    actions[String(idx++)] = { label: 'Літати', run: () => tryAction('Літати', () => (animal as Parrot).fly()) };
    actions[String(idx++)] = { label: 'Співати', run: () => tryAction('Співати', () => (animal as Parrot).sing()) };
  }
  if (animalType === 'snake') {
    actions[String(idx++)] = { label: 'Повзти', run: () => tryAction('Повзти', () => (animal as Snake).crawl()) };
  }

  return actions;
}

function runInteractive(rl: readline.Interface): void {
  section('ІНТЕРАКТИВНИЙ РЕЖИМ');

  const habitatMenu: Record<string, { label: string; type: HabitatType }> = {
    '1': { label: 'Хазяїн (OwnerHabitat)',      type: 'owner' },
    '2': { label: 'Зоомагазин (PetShopHabitat)', type: 'petshop' },
    '3': { label: 'Дика природа (WildHabitat)',  type: 'wild' },
  };

  const animalMenu: Record<string, { label: string; type: AnimalType }> = {
    '1': { label: 'Кіт',    type: 'cat' },
    '2': { label: 'Папуга', type: 'parrot' },
    '3': { label: 'Змія',   type: 'snake' },
  };

  console.log('\n  Оберіть середовище:');
  for (const [k, v] of Object.entries(habitatMenu)) {
    console.log(`    ${k}. ${v.label}`);
  }

  rl.question('\nВаш вибір: ', (hChoice) => {
    const pickedHabitat = habitatMenu[hChoice.trim()];
    if (!pickedHabitat) {
      console.log('  Невідомий тип. Повернення до меню.');
      prompt();
      return;
    }

    const namePrompt =
      pickedHabitat.type === 'owner'   ? "  Ім'я хазяїна: " :
      pickedHabitat.type === 'petshop' ? '  Назва магазину: ' :
                                         '  (Дика природа — назва не потрібна, Enter): ';

    rl.question(namePrompt, (hName) => {
      const habitatName = hName.trim() ||
        (pickedHabitat.type === 'owner' ? 'Хазяїн' :
         pickedHabitat.type === 'petshop' ? 'Зоомагазин' : 'Дика природа');

      console.log('\n  Оберіть тварину:');
      for (const [k, v] of Object.entries(animalMenu)) {
        console.log(`    ${k}. ${v.label}`);
      }

      rl.question('\nВаш вибір: ', (aChoice) => {
        const pickedAnimal = animalMenu[aChoice.trim()];
        if (!pickedAnimal) {
          console.log('  Невідомий тип. Повернення до меню.');
          prompt();
          return;
        }

        rl.question(`  Ім'я ${pickedAnimal.label.toLowerCase()}: `, (aName) => {
          const animalName = aName.trim() || pickedAnimal.label;
          const sim = new TimeSimulator(0);
          const factory = getFactory(pickedAnimal.type);

          let animal: Animal;
          let feedFn:    (() => void) | null = null;
          let cleanFn:   (() => void) | null = null;
          let releaseFn: () => void = () => {};

          if (pickedHabitat.type === 'owner') {
            const habitat = new OwnerHabitat(habitatName);
            animal    = habitat.adopt(factory, animalName, sim.nowHours);
            feedFn    = () => { habitat.feed(); };
            cleanFn   = () => { habitat.cleanUp(); };
            releaseFn = () => { habitat.release(); };
          } else if (pickedHabitat.type === 'petshop') {
            const habitat = new PetShopHabitat(habitatName);
            animal    = habitat.addAnimal(factory, animalName, sim.nowHours);
            feedFn    = () => { habitat.feed(animal); };
            cleanFn   = () => { habitat.cleanUp(animal); };
            releaseFn = () => { habitat.removeAnimal(animal); };
          } else {
            const habitat = new WildHabitat();
            animal    = habitat.addAnimal(factory, animalName, sim.nowHours);
            releaseFn = () => { habitat.removeAnimal(animal); };
          }

          sim.register(animal);
          console.log(`\n  Створено: ${animal}`);
          console.log(`  Середовище: ${pickedHabitat.label}`);

          const actions = buildInteractiveActions(
            pickedAnimal.type,
            animal, sim, feedFn, cleanFn,
          );

          function actionLoop(): void {
            console.log('\n' + '-'.repeat(62));
            console.log(`  ${sim.timestamp} | ${animal}`);
            console.log('-'.repeat(62));
            for (const [k, v] of Object.entries(actions)) {
              console.log(`  ${k}. ${v.label}`);
            }
            console.log('  q. Назад до головного меню');

            rl.question('\nДія: ', (ans) => {
              const a = ans.trim().toLowerCase();
              if (a === 'q') {
                releaseFn();
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
    });
  });
}

// ─── Menu ────────────────────────────────────────────────────────────────────

const scenarios: Record<string, { label: string; run: () => void }> = {
  '1': { label: "Хазяїн Олена — Factory Method + Observer",  run: runScenario1 },
  '2': { label: "Зоомагазин 'Лапки' — кілька тварин",       run: runScenario2 },
  '3': { label: "Дика природа — смерть від голоду",          run: runScenario3 },
  '4': { label: "Обмеження хазяїна — тільки одна тварина",   run: runScenario4 },
};

function printMenu(): void {
  console.log('\n' + '='.repeat(62));
  console.log('  МЕНЮ СЦЕНАРІЇВ');
  console.log('='.repeat(62));
  for (const [key, { label }] of Object.entries(scenarios)) {
    console.log(`  ${key}. ${label}`);
  }
  console.log('  5. Інтерактивний режим');
  console.log('  q. Вийти');
  console.log('='.repeat(62));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(): void {
  printMenu();
  rl.question('\nВаш вибір: ', (answer) => {
    const choice = answer.trim().toLowerCase();

    if (choice === 'q') {
      console.log('\nДо побачення!');
      rl.close();
      return;
    }

    if (choice === '5') {
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
