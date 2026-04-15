import { Animal } from '../models/Animal';
import { IAnimalFactory } from '../factory/IAnimalFactory';
import { FedEventArgs } from '../events/FedEventArgs';
import { HungryEventArgs } from '../events/HungryEventArgs';
import { CleanedEventArgs } from '../events/CleanedEventArgs';
import { HappinessChangedEventArgs } from '../events/HappinessChangedEventArgs';
import { DiedEventArgs } from '../events/DiedEventArgs';

export class OwnerHabitat {
  private _animal: Animal | null = null;
  private _unsubscribe: (() => void) | null = null;

  constructor(readonly ownerName: string) {}

  get animal(): Animal | null { return this._animal; }

  adopt(factory: IAnimalFactory, name: string, startHours: number): Animal {
    if (this._animal !== null) {
      throw new Error(`${this.ownerName} вже має тварину`);
    }
    const animal = factory.create(name, startHours);
    this._animal = animal;
    this._subscribe(animal);
    return animal;
  }

  feed(): boolean {
    if (!this._animal) throw new Error('Немає тварини');
    return this._animal.eat();
  }

  cleanUp(): void {
    if (!this._animal) throw new Error('Немає тварини');
    this._animal.clean();
  }

  release(): void {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    this._animal = null;
  }

  private _subscribe(animal: Animal): void {
    const onFed = (_: Animal, a: FedEventArgs) =>
      console.log(`[${this.ownerName}] нагодував ${a.animalName}. Їжа сьогодні: ${a.mealsToday}/5`);

    const onHungry = (_: Animal, a: HungryEventArgs) =>
      console.log(`[${this.ownerName}] ${a.animalName} голодний! (${a.hoursSinceLastMeal.toFixed(1)} год без їжі)`);

    const onCleaned = (_: Animal, a: CleanedEventArgs) =>
      console.log(`[${this.ownerName}] прибрав у ${a.animalName}. Прибирань сьогодні: ${a.cleansToday}`);

    const onHappinessChanged = (_: Animal, a: HappinessChangedEventArgs) =>
      console.log(`[${this.ownerName}] ${a.animalName}: ${a.isHappy ? 'тварина щаслива' : 'тварина більше не щаслива'}`);

    const onDied = (_: Animal, a: DiedEventArgs) =>
      console.log(`[${this.ownerName}] ${a.animalName} загинув від: ${a.reason}`);

    animal.addFedListener(onFed);
    animal.addHungryListener(onHungry);
    animal.addCleanedListener(onCleaned);
    animal.addHappinessChangedListener(onHappinessChanged);
    animal.addDiedListener(onDied);

    this._unsubscribe = () => {
      animal.removeFedListener(onFed);
      animal.removeHungryListener(onHungry);
      animal.removeCleanedListener(onCleaned);
      animal.removeHappinessChangedListener(onHappinessChanged);
      animal.removeDiedListener(onDied);
    };
  }
}
