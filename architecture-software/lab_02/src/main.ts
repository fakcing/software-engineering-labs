import * as readline from 'readline';
import { Cat } from './models/Cat';
import { Parrot } from './models/Parrot';
import { Snake } from './models/Snake';
import { CatFactory, ParrotFactory, SnakeFactory } from './factory/AnimalFactory';
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

// ══════════════════════════════════════════════════════════════════
// СЦЕНАРІЙ 1: Хазяїн з котом — Factory Method + Observer
// ══════════════════════════════════════════════════════════════════
function runScenario1(): void {
  section("СЦЕНАРІЙ 1: Хазяїн Олена — Factory Method + Observer");

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

// ══════════════════════════════════════════════════════════════════
// СЦЕНАРІЙ 2: Зоомагазин — кілька тварин різних видів
// ══════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════
// СЦЕНАРІЙ 3: Дика природа — багато тварин, смерть від голоду
// ══════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════
// СЦЕНАРІЙ 4: Обмеження хазяїна — тільки одна тварина
// ══════════════════════════════════════════════════════════════════
function runScenario4(): void {
  section("СЦЕНАРІЙ 4: Обмеження хазяїна — тільки одна тварина");

  const catFactory   = new CatFactory();
  const snakeFactory = new SnakeFactory();

  const ivan = new OwnerHabitat('Іван');
  ivan.adopt(snakeFactory, 'Вася', 0);

  tryAction('Іван заводить другу тварину', () => ivan.adopt(catFactory, 'Мурка', 0));

  console.log(`  Тварина Івана: ${ivan.animal}`);
}

// ══════════════════════════════════════════════════════════════════
// Меню
// ══════════════════════════════════════════════════════════════════
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
