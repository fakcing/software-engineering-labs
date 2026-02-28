import { ICanEat } from "../interfaces";

type AnimalEventHandler = (animal: Animal) => void;

export abstract class Animal implements ICanEat {
  abstract readonly species: string;

  private static readonly MAX_MEALS_PER_DAY = 5;
  private static readonly MIN_MEAL_INTERVAL_H = 24 / Animal.MAX_MEALS_PER_DAY;
  private static readonly HUNGER_THRESHOLD_H = 8;
  private static readonly DEATH_THRESHOLD_H = 24;

  private _isAlive = true;
  private _isHappy = false;
  private _lastMealTime: number;
  private _mealsToday = 0;
  private _cleansToday = 0;
  private _dayStart: number;
  private _currentHours: number;

  private _onHungryHandlers: AnimalEventHandler[] = [];
  private _onFedHandlers: AnimalEventHandler[] = [];
  private _onCleanedHandlers: AnimalEventHandler[] = [];
  private _onHappinessChangedHandlers: AnimalEventHandler[] = [];
  private _onDiedHandlers: AnimalEventHandler[] = [];

  constructor(readonly name: string, startHours: number) {
    this._currentHours = startHours;
    this._lastMealTime = startHours;
    this._dayStart = startHours;
  }

  get isAlive(): boolean {
    return this._isAlive;
  }

  get isHappy(): boolean {
    return this._isAlive && this._isHappy;
  }

  get isHungry(): boolean {
    return this._isAlive && this._currentHours - this._lastMealTime > Animal.HUNGER_THRESHOLD_H;
  }

  get mealsToday(): number {
    return this._mealsToday;
  }

  get cleansToday(): number {
    return this._cleansToday;
  }

  get hoursSinceLastMeal(): number {
    return this._currentHours - this._lastMealTime;
  }

  onHungry(handler: AnimalEventHandler): () => void {
    this._onHungryHandlers.push(handler);
    return () => {
      this._onHungryHandlers = this._onHungryHandlers.filter(h => h !== handler);
    };
  }

  onFed(handler: AnimalEventHandler): () => void {
    this._onFedHandlers.push(handler);
    return () => {
      this._onFedHandlers = this._onFedHandlers.filter(h => h !== handler);
    };
  }

  onCleaned(handler: AnimalEventHandler): () => void {
    this._onCleanedHandlers.push(handler);
    return () => {
      this._onCleanedHandlers = this._onCleanedHandlers.filter(h => h !== handler);
    };
  }

  onHappinessChanged(handler: AnimalEventHandler): () => void {
    this._onHappinessChangedHandlers.push(handler);
    return () => {
      this._onHappinessChangedHandlers = this._onHappinessChangedHandlers.filter(h => h !== handler);
    };
  }

  onDied(handler: AnimalEventHandler): () => void {
    this._onDiedHandlers.push(handler);
    return () => {
      this._onDiedHandlers = this._onDiedHandlers.filter(h => h !== handler);
    };
  }

  advanceTime(newHours: number): void {
    if (newHours < this._currentHours) {
      throw new Error("Час не може йти назад");
    }

    const daysPassed = Math.floor((newHours - this._dayStart) / 24);
    if (daysPassed > 0) {
      this._dayStart += daysPassed * 24;
      this._mealsToday = 0;
      this._cleansToday = 0;
      this._updateHappiness();
    }

    this._currentHours = newHours;
    this._checkVitals();
  }

  eat(): boolean {
    if (!this._isAlive) {
      return false;
    }

    const hoursSinceLast = this._currentHours - this._lastMealTime;
    if (hoursSinceLast < Animal.MIN_MEAL_INTERVAL_H) {
      return false;
    }

    if (this._mealsToday >= Animal.MAX_MEALS_PER_DAY) {
      this._die("переїдання");
      return false;
    }

    this._lastMealTime = this._currentHours;
    this._mealsToday++;
    this._onFedHandlers.forEach(h => h(this));
    return true;
  }

  clean(): void {
    if (!this._isAlive) {
      return;
    }
    this._cleansToday++;
    this._onCleanedHandlers.forEach(h => h(this));
    this._updateHappiness();
  }

  protected canRunOrFly(): boolean {
    return this._isAlive && !this.isHungry;
  }

  protected canAct(): boolean {
    return this._isAlive;
  }

  private _checkVitals(): void {
    if (!this._isAlive) {
      return;
    }

    if (this._currentHours - this._lastMealTime >= Animal.DEATH_THRESHOLD_H) {
      this._die("голод");
      return;
    }

    if (this.isHungry) {
      this._onHungryHandlers.forEach(h => h(this));
    }

    this._updateHappiness();
  }

  private _updateHappiness(): void {
    const nowHappy = this._cleansToday >= 1;
    if (nowHappy !== this._isHappy) {
      this._isHappy = nowHappy;
      this._onHappinessChangedHandlers.forEach(h => h(this));
    }
  }

  private _die(reason: string): void {
    if (!this._isAlive) {
      return;
    }
    this._isAlive = false;
    this._onDiedHandlers.forEach(h => h(this));
  }

  toString(): string {
    if (!this._isAlive) {
      return `[${this.species}] ${this.name} - МЕРТВИЙ`;
    }
    return `[${this.species}] ${this.name} - живий | голодний: ${this.isHungry} | щасливий: ${this._isHappy} | їжа сьогодні: ${this._mealsToday}/5 | годин без їжі: ${this.hoursSinceLastMeal.toFixed(1)}`;
  }
}
