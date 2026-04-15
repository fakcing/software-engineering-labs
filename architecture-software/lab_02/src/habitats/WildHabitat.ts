import { Animal } from '../models/Animal';
import { IAnimalFactory } from '../factory/IAnimalFactory';
import { HungryEventArgs } from '../events/HungryEventArgs';
import { DiedEventArgs } from '../events/DiedEventArgs';

export class WildHabitat {
  private readonly _animals: Map<Animal, () => void> = new Map();

  get animals(): Animal[] { return Array.from(this._animals.keys()); }

  addAnimal(factory: IAnimalFactory, name: string, startHours: number): Animal {
    const animal = factory.create(name, startHours);
    animal.setWild(true);
    const unsub = this._subscribe(animal);
    this._animals.set(animal, unsub);
    return animal;
  }

  removeAnimal(animal: Animal): void {
    const unsub = this._animals.get(animal);
    if (unsub) { unsub(); this._animals.delete(animal); }
  }

  private _subscribe(animal: Animal): () => void {
    const onHungry = (_: Animal, a: HungryEventArgs) =>
      console.log(`[Дика природа] ${a.animalName} (${a.species}) голодний! (${a.hoursSinceLastMeal.toFixed(1)} год)`);

    const onDied = (_: Animal, a: DiedEventArgs) =>
      console.log(`[Дика природа] ${a.animalName} (${a.species}) загинув від: ${a.reason}`);

    animal.addHungryListener(onHungry);
    animal.addDiedListener(onDied);

    return () => {
      animal.removeHungryListener(onHungry);
      animal.removeDiedListener(onDied);
    };
  }
}
