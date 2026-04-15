import { ICanEat } from '../interfaces';
import { FedEventArgs } from '../events/FedEventArgs';
import { HungryEventArgs } from '../events/HungryEventArgs';
import { CleanedEventArgs } from '../events/CleanedEventArgs';
import { HappinessChangedEventArgs } from '../events/HappinessChangedEventArgs';
import { DiedEventArgs } from '../events/DiedEventArgs';

type Handler<T> = (sender: Animal, args: T) => void;

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
  private _isWild = false;

  private _fedHandlers: Handler<FedEventArgs>[] = [];
  private _hungryHandlers: Handler<HungryEventArgs>[] = [];
  private _cleanedHandlers: Handler<CleanedEventArgs>[] = [];
  private _happinessChangedHandlers: Handler<HappinessChangedEventArgs>[] = [];
  private _diedHandlers: Handler<DiedEventArgs>[] = [];

  constructor(readonly name: string, startHours: number) {
    this._currentHours = startHours;
    this._lastMealTime = startHours;
    this._dayStart = startHours;
  }

  get isAlive(): boolean { return this._isAlive; }
  get isHappy(): boolean { return this._isAlive && this._isHappy; }
  get isHungry(): boolean {
    return this._isAlive && this._currentHours - this._lastMealTime > Animal.HUNGER_THRESHOLD_H;
  }
  get mealsToday(): number { return this._mealsToday; }
  get cleansToday(): number { return this._cleansToday; }
  get hoursSinceLastMeal(): number { return this._currentHours - this._lastMealTime; }

  setWild(value: boolean): void {
    this._isWild = value;
    if (value) {
      this._isHappy = true;
    }
  }

  addFedListener(h: Handler<FedEventArgs>): void { this._fedHandlers.push(h); }
  removeFedListener(h: Handler<FedEventArgs>): void { this._fedHandlers = this._fedHandlers.filter(f => f !== h); }

  addHungryListener(h: Handler<HungryEventArgs>): void { this._hungryHandlers.push(h); }
  removeHungryListener(h: Handler<HungryEventArgs>): void { this._hungryHandlers = this._hungryHandlers.filter(f => f !== h); }

  addCleanedListener(h: Handler<CleanedEventArgs>): void { this._cleanedHandlers.push(h); }
  removeCleanedListener(h: Handler<CleanedEventArgs>): void { this._cleanedHandlers = this._cleanedHandlers.filter(f => f !== h); }

  addHappinessChangedListener(h: Handler<HappinessChangedEventArgs>): void { this._happinessChangedHandlers.push(h); }
  removeHappinessChangedListener(h: Handler<HappinessChangedEventArgs>): void { this._happinessChangedHandlers = this._happinessChangedHandlers.filter(f => f !== h); }

  addDiedListener(h: Handler<DiedEventArgs>): void { this._diedHandlers.push(h); }
  removeDiedListener(h: Handler<DiedEventArgs>): void { this._diedHandlers = this._diedHandlers.filter(f => f !== h); }

  protected onFed(args: FedEventArgs): void { this._fedHandlers.forEach(h => h(this, args)); }
  protected onHungry(args: HungryEventArgs): void { this._hungryHandlers.forEach(h => h(this, args)); }
  protected onCleaned(args: CleanedEventArgs): void { this._cleanedHandlers.forEach(h => h(this, args)); }
  protected onHappinessChanged(args: HappinessChangedEventArgs): void { this._happinessChangedHandlers.forEach(h => h(this, args)); }
  protected onDied(args: DiedEventArgs): void { this._diedHandlers.forEach(h => h(this, args)); }

  advanceTime(newHours: number): void {
    if (newHours < this._currentHours) {
      throw new Error('Час не може йти назад');
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
    if (!this._isAlive) return false;
    const hoursSinceLast = this._currentHours - this._lastMealTime;
    if (hoursSinceLast < Animal.MIN_MEAL_INTERVAL_H) return false;
    if (this._mealsToday >= Animal.MAX_MEALS_PER_DAY) {
      this._die('переїдання');
      return false;
    }
    this._lastMealTime = this._currentHours;
    this._mealsToday++;
    this.onFed(new FedEventArgs(this.name, this.species, this._mealsToday));
    return true;
  }

  clean(): void {
    if (!this._isAlive) return;
    this._cleansToday++;
    this.onCleaned(new CleanedEventArgs(this.name, this.species, this._cleansToday));
    this._updateHappiness();
  }

  protected canRunOrFly(): boolean { return this._isAlive && !this.isHungry; }
  protected canAct(): boolean { return this._isAlive; }

  private _checkVitals(): void {
    if (!this._isAlive) return;
    if (this._currentHours - this._lastMealTime >= Animal.DEATH_THRESHOLD_H) {
      this._die('голод');
      return;
    }
    if (this.isHungry) {
      this.onHungry(new HungryEventArgs(this.name, this.species, this.hoursSinceLastMeal));
    }
    this._updateHappiness();
  }

  private _updateHappiness(): void {
    const nowHappy = this._isWild || this._cleansToday >= 1;
    if (nowHappy !== this._isHappy) {
      this._isHappy = nowHappy;
      this.onHappinessChanged(new HappinessChangedEventArgs(this.name, this.species, this._isHappy));
    }
  }

  private _die(reason: 'голод' | 'переїдання'): void {
    if (!this._isAlive) return;
    this._isAlive = false;
    this.onDied(new DiedEventArgs(this.name, this.species, reason));
  }

  toString(): string {
    if (!this._isAlive) return `[${this.species}] ${this.name} - МЕРТВИЙ`;
    return `[${this.species}] ${this.name} - живий | голодний: ${this.isHungry} | щасливий: ${this._isHappy} | їжа: ${this._mealsToday}/5 | год без їжі: ${this.hoursSinceLastMeal.toFixed(1)}`;
  }
}
