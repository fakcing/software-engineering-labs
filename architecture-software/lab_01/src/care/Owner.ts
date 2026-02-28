import { Animal } from "../models/Animal";

export class Owner {
  private readonly _animal: Animal;
  private readonly _unsubscribers: Array<() => void> = [];

  constructor(readonly ownerName: string, animal: Animal) {
    this._animal = animal;
    this._subscribe();
  }

  get animal(): Animal {
    return this._animal;
  }

  feed(): boolean {
    return this._animal.eat();
  }

  cleanUp(): void {
    this._animal.clean();
  }

  dispose(): void {
    this._unsubscribers.forEach(unsub => unsub());
    this._unsubscribers.length = 0;
  }

  private _subscribe(): void {
    this._unsubscribers.push(
      this._animal.onHungry(animal => {
        console.log(`[${this.ownerName}] ${animal.name} голодний! (${animal.hoursSinceLastMeal.toFixed(1)} год без їжі)`);
      }),
      this._animal.onFed(animal => {
        console.log(`[${this.ownerName}] нагодував ${animal.name}. Прийомів їжі сьогодні: ${animal.mealsToday}/5`);
      }),
      this._animal.onCleaned(animal => {
        console.log(`[${this.ownerName}] прибрав у ${animal.name}. Прибирань сьогодні: ${animal.cleansToday}`);
      }),
      this._animal.onHappinessChanged(animal => {
        const msg = animal.isHappy ? "тварина щаслива" : "тварина більше не щаслива";
        console.log(`[${this.ownerName}] ${animal.name}: ${msg}`);
      }),
      this._animal.onDied(animal => {
        console.log(`[${this.ownerName}] ${animal.name} загинув!`);
      })
    );
  }
}
