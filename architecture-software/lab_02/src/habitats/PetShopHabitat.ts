import { Animal } from '../models/Animal';
import { IAnimalFactory } from '../factory/IAnimalFactory';
import { FedEventArgs } from '../events/FedEventArgs';
import { HungryEventArgs } from '../events/HungryEventArgs';
import { CleanedEventArgs } from '../events/CleanedEventArgs';
import { HappinessChangedEventArgs } from '../events/HappinessChangedEventArgs';
import { DiedEventArgs } from '../events/DiedEventArgs';

export class PetShopHabitat {
  private readonly _animals: Map<Animal, () => void> = new Map();

  constructor(readonly shopName: string) {}

  get animals(): Animal[] { return Array.from(this._animals.keys()); }

  addAnimal(factory: IAnimalFactory, name: string, startHours: number): Animal {
    const animal = factory.create(name, startHours);
    const unsub = this._subscribe(animal);
    this._animals.set(animal, unsub);
    return animal;
  }

  feed(animal: Animal): boolean {
    if (!this._animals.has(animal)) throw new Error('Ця тварина не в зоомагазині');
    return animal.eat();
  }

  cleanUp(animal: Animal): void {
    if (!this._animals.has(animal)) throw new Error('Ця тварина не в зоомагазині');
    animal.clean();
  }

  removeAnimal(animal: Animal): void {
    const unsub = this._animals.get(animal);
    if (unsub) { unsub(); this._animals.delete(animal); }
  }

  private _subscribe(animal: Animal): () => void {
    const onFed = (_: Animal, a: FedEventArgs) =>
      console.log(`[${this.shopName}] нагодований ${a.animalName} (${a.species}). Їжа: ${a.mealsToday}/5`);

    const onHungry = (_: Animal, a: HungryEventArgs) =>
      console.log(`[${this.shopName}] ${a.animalName} (${a.species}) голодний! (${a.hoursSinceLastMeal.toFixed(1)} год)`);

    const onCleaned = (_: Animal, a: CleanedEventArgs) =>
      console.log(`[${this.shopName}] прибрано у ${a.animalName}. Прибирань: ${a.cleansToday}`);

    const onHappinessChanged = (_: Animal, a: HappinessChangedEventArgs) =>
      console.log(`[${this.shopName}] ${a.animalName}: ${a.isHappy ? 'щаслива' : 'не щаслива'}`);

    const onDied = (_: Animal, a: DiedEventArgs) =>
      console.log(`[${this.shopName}] ${a.animalName} загинув від: ${a.reason}`);

    animal.addFedListener(onFed);
    animal.addHungryListener(onHungry);
    animal.addCleanedListener(onCleaned);
    animal.addHappinessChangedListener(onHappinessChanged);
    animal.addDiedListener(onDied);

    return () => {
      animal.removeFedListener(onFed);
      animal.removeHungryListener(onHungry);
      animal.removeCleanedListener(onCleaned);
      animal.removeHappinessChangedListener(onHappinessChanged);
      animal.removeDiedListener(onDied);
    };
  }
}
