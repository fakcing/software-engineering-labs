import { Animal } from "../models/Animal";

export class WildLife {
  private readonly _unsubscribers: Array<() => void> = [];

  constructor(private readonly _animal: Animal) {
    this._subscribe();
  }

  get animal(): Animal {
    return this._animal;
  }

  dispose(): void {
    this._unsubscribers.forEach(u => u());
    this._unsubscribers.length = 0;
  }

  private _subscribe(): void {
    this._unsubscribers.push(
      this._animal.onHungry(animal => {
        console.log(`[Дика природа] ${animal.name} голодний! (${animal.hoursSinceLastMeal.toFixed(1)} год без їжі)`);
      }),
      this._animal.onDied(animal => {
        console.log(`[Дика природа] ${animal.name} загинув`);
      })
    );
  }
}
