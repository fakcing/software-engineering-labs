# Лабораторна робота №2 — Архітектурні патерни: симуляція тварин

## Огляд

Система симуляції домашніх тварин у різних середовищах проживання (хазяїн, зоомагазин, дика природа). Проєкт демонструє застосування патернів **Factory Method** та **Observer** у TypeScript.

## Структура проєкту

```
src/
├── main.ts                          # Точка входу, сценарії та інтерактивне меню
├── interfaces/
│   └── index.ts                     # Інтерфейси можливостей тварин
├── models/
│   ├── Animal.ts                    # Абстрактний базовий клас
│   ├── Cat.ts                       # Кіт
│   ├── Parrot.ts                    # Папуга
│   └── Snake.ts                     # Змія
├── events/
│   ├── AnimalEventArgs.ts           # Базовий клас події
│   ├── FedEventArgs.ts              # Подія "нагодовано"
│   ├── HungryEventArgs.ts           # Подія "голод"
│   ├── CleanedEventArgs.ts          # Подія "прибрано"
│   ├── HappinessChangedEventArgs.ts # Подія "зміна щастя"
│   └── DiedEventArgs.ts             # Подія "смерть"
├── factory/
│   ├── IAnimalFactory.ts            # Інтерфейс фабрики
│   └── AnimalFactory.ts             # Конкретні фабрики
├── habitats/
│   ├── OwnerHabitat.ts              # Середовище хазяїна (одна тварина)
│   ├── PetShopHabitat.ts            # Зоомагазин (багато тварин)
│   └── WildHabitat.ts               # Дика природа
└── simulation/
    └── TimeSimulator.ts             # Управління симульованим часом
```

---

## Застосовані патерни

### 1. Factory Method (Фабричний метод)

**Де:** `src/factory/`

**Суть:** Визначає інтерфейс для створення об'єкта, але залишає підкласам вирішення, який клас інстанціювати.

**Проблема, яку вирішує:** Середовища (`OwnerHabitat`, `PetShopHabitat`, `WildHabitat`) повинні створювати тварин, не знаючи про конкретні класи `Cat`, `Parrot`, `Snake`.

**Реалізація:**

```
IAnimalFactory (інтерфейс)
  └── create(name, startHours): Animal

CatFactory    implements IAnimalFactory  →  створює Cat
ParrotFactory implements IAnimalFactory  →  створює Parrot
SnakeFactory  implements IAnimalFactory  →  створює Snake
```

```typescript
// Інтерфейс — контракт для всіх фабрик
export interface IAnimalFactory {
  create(name: string, startHours: number): Animal;
}

// Конкретна фабрика
export class CatFactory implements IAnimalFactory {
  create(name: string, startHours: number): Animal {
    return new Cat(name, startHours);
  }
}

// Середовище використовує фабрику, не знаючи про Cat/Parrot/Snake
const animal = factory.create('Барсик', sim.nowHours);
```

**Переваги в даному проєкті:**
- Додавання нового виду тварини (наприклад, `Dog`) вимагає лише нового класу `DogFactory` без зміни хабітатів.
- Тестування хабітатів із mock-фабриками без реальних об'єктів.

---

### 2. Observer (Спостерігач)

**Де:** `src/models/Animal.ts` (видавець) + `src/habitats/` (підписники) + `src/events/` (дані подій)

**Суть:** Визначає залежність "один до багатьох" між об'єктами. При зміні стану одного об'єкта всі залежні автоматично сповіщаються.

**Проблема, яку вирішує:** Хабітати повинні реагувати на зміни стану тварин (голод, смерть, щастя), але тварини не повинні знати про хабітати.

**Реалізація — власноруч реалізований event-bus:**

```
Animal (видавець)
  ├── onFed()              →  Handler<FedEventArgs>[]
  ├── onHungry()           →  Handler<HungryEventArgs>[]
  ├── onCleaned()          →  Handler<CleanedEventArgs>[]
  ├── onHappinessChanged() →  Handler<HappinessChangedEventArgs>[]
  └── onDied()             →  Handler<DiedEventArgs>[]

OwnerHabitat    (підписник) — підписується на всі 5 подій
PetShopHabitat  (підписник) — підписується на всі 5 подій
WildHabitat     (підписник) — підписується лише на Hungry + Died
```

```typescript
// Тип обробника — generic для кожного виду події
type Handler<T> = (sender: Animal, args: T) => void;

// Підписка
addFedListener(h: Handler<FedEventArgs>): void {
  this._fedHandlers.push(h);
}

// Відписка
removeFedListener(h: Handler<FedEventArgs>): void {
  this._fedHandlers = this._fedHandlers.filter(x => x !== h);
}

// Виклик усіх слухачів при зміні стану
protected onFed(args: FedEventArgs): void {
  this._fedHandlers.forEach(h => h(this, args));
}
```

**Управління підпискою в хабітатах:**

```typescript
// Хабітат підписується — отримує функцію відписки для cleanup
private _subscribe(animal: Animal): () => void {
  const onFed     = (sender: Animal, args: FedEventArgs) => { ... };
  const onHungry  = (sender: Animal, args: HungryEventArgs) => { ... };
  // ...

  animal.addFedListener(onFed);
  animal.addHungryListener(onHungry);

  // Повертає функцію cleanup — запобігає memory leak
  return () => {
    animal.removeFedListener(onFed);
    animal.removeHungryListener(onHungry);
  };
}
```

**Різниця підписок між хабітатами:**

| Подія              | OwnerHabitat | PetShopHabitat | WildHabitat |
|--------------------|:---:|:---:|:---:|
| Fed (нагодовано)   | ✓   | ✓   | —   |
| Hungry (голод)     | ✓   | ✓   | ✓   |
| Cleaned (прибрано) | ✓   | ✓   | —   |
| HappinessChanged   | ✓   | ✓   | —   |
| Died (смерть)      | ✓   | ✓   | ✓   |

---

### 3. Abstract Base Class + Template Method

**Де:** `src/models/Animal.ts`

**Суть:** Абстрактний клас визначає загальну поведінку та структуру, залишаючи конкретні деталі підкласам.

**Реалізація:**

```typescript
export abstract class Animal {
  abstract readonly species: string;  // підклас зобов'язаний визначити вид

  // Загальна логіка — однакова для всіх тварин
  eat(): void { ... }
  advanceTime(hours: number): void { ... }

  // Захищені методи — дозволяють підкласам перевизначити поведінку
  protected canRunOrFly(): boolean { return !this._isHungry; }
  protected canAct(): boolean { return this._isAlive; }
}

// Підклас визначає лише специфіку
export class Cat extends Animal implements ICanWalk, ICanRun, ICanSing {
  readonly species = 'Кіт';
  walk(): void { ... }
  run(): void { if (!this.canRunOrFly()) throw new Error('Голодний!'); ... }
  sing(): void { if (!this.canRunOrFly()) throw new Error('Голодний!'); ... }
}
```

---

### 4. Interface Segregation (Segregation Interfaces / ISP)

**Де:** `src/interfaces/index.ts`

**Суть:** Клієнти не повинні залежати від інтерфейсів, які вони не використовують. Замість одного великого інтерфейсу — кілька вузьких.

**Реалізація — 6 окремих інтерфейсів:**

```typescript
interface ICanEat   { eat(): void }
interface ICanWalk  { walk(): void }
interface ICanRun   { run(): void }
interface ICanFly   { fly(): void }
interface ICanCrawl { crawl(): void }
interface ICanSing  { sing(): void }
```

**Реалізація тваринами:**

| Інтерфейс  | Cat | Parrot | Snake |
|------------|:---:|:------:|:-----:|
| ICanEat    | ✓   | ✓      | ✓     |
| ICanWalk   | ✓   | ✓      | ✓     |
| ICanRun    | ✓   | —      | —     |
| ICanFly    | —   | ✓      | —     |
| ICanCrawl  | —   | —      | ✓     |
| ICanSing   | ✓   | ✓      | —     |

```typescript
export class Cat    extends Animal implements ICanWalk, ICanRun, ICanSing { ... }
export class Parrot extends Animal implements ICanWalk, ICanFly, ICanSing { ... }
export class Snake  extends Animal implements ICanWalk, ICanCrawl         { ... }
```

---

### 5. Event Args Inheritance (ієрархія об'єктів подій)

**Де:** `src/events/`

**Суть:** Всі події успадковуються від спільного базового класу, що дозволяє уніфіковано обробляти та логувати їх.

```
AnimalEventArgs
  ├── FedEventArgs           { mealsToday, totalMeals }
  ├── HungryEventArgs        { hoursSinceLastMeal }
  ├── CleanedEventArgs       { cleansToday }
  ├── HappinessChangedEventArgs { isHappy }
  └── DiedEventArgs          { cause }
```

---

## Ієрархія класів

```
Animal (abstract)
├── Cat    implements ICanWalk, ICanRun, ICanSing
├── Parrot implements ICanWalk, ICanFly, ICanSing
└── Snake  implements ICanWalk, ICanCrawl

IAnimalFactory (interface)
├── CatFactory    → new Cat(...)
├── ParrotFactory → new Parrot(...)
└── SnakeFactory  → new Snake(...)

OwnerHabitat
  - animal: Animal | null
  - adopt(factory, name): Animal   ← використовує Factory Method
  - підписується на всі 5 подій    ← використовує Observer

PetShopHabitat
  - animals: Map<Animal, unsubFn>
  - addAnimal(factory, name): Animal
  - підписується на всі 5 подій

WildHabitat
  - animals: Map<Animal, unsubFn>
  - addAnimal(factory, name): Animal
  - підписується лише на Hungry + Died

TimeSimulator
  - registered: Set<Animal>
  - advance(hours): void           ← оновлює стан всіх тварин
```

---

## Бізнес-правила симуляції

| Параметр | Значення |
|----------|----------|
| Максимум їжі на день | 5 прийомів |
| Мінімальний інтервал між годуваннями | 4.8 год |
| Поріг голоду | 8 год без їжі |
| Поріг смерті | 24 год без їжі |
| Щастя (хазяїн/магазин) | прибрано ≥1 раз на день |
| Щастя (дика природа) | завжди `true` |
| Біг/літ/спів при голоді | заблоковано (`throw`) |
| Ходьба при голоді | дозволена |

---

## Сценарії демонстрації

| # | Сценарій | Демонструє |
|---|----------|-----------|
| 1 | Хазяїн Олена — кіт Барсик | Factory Method + Observer (годування, голод, максимум) |
| 2 | Зоомагазин «Лапки» — кіт, папуга, змія | Observer з кількома підписниками |
| 3 | Дика природа — смерть від голоду | Observer (подія Died), WildHabitat без годування |
| 4 | Обмеження хазяїна | OwnerHabitat дозволяє лише одну тварину |
| 5 | Інтерактивний режим | Вибір середовища та тварини вручну |

---

## Запуск

```bash
npm install
npm start
```

---

## Технології

- **TypeScript** — строга типізація, абстрактні класи, інтерфейси
- **Node.js** — readline для інтерактивного меню
- **ts-node** — виконання TypeScript без попередньої компіляції
