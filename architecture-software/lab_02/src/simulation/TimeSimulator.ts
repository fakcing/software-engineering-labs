import { Animal } from '../models/Animal';

export class TimeSimulator {
  private _currentHours: number;
  private readonly _animals: Set<Animal> = new Set();

  constructor(startHours = 0) {
    this._currentHours = startHours;
  }

  get nowHours(): number { return this._currentHours; }

  get timestamp(): string {
    const total = Math.round(this._currentHours * 60);
    const days  = Math.floor(total / (24 * 60));
    const hours = Math.floor((total % (24 * 60)) / 60);
    const mins  = total % 60;
    return `День ${days + 1} ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  register(animal: Animal): void   { this._animals.add(animal); }
  unregister(animal: Animal): void { this._animals.delete(animal); }

  advance(hours: number): void {
    this._currentHours += hours;
    console.log(`\n--- Час: ${this.timestamp} (+${hours} год) ---`);
    for (const animal of this._animals) {
      animal.advanceTime(this._currentHours);
    }
  }
}
