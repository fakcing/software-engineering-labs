import { Animal } from './Animal';
import { ICanWalk, ICanFly, ICanSing } from '../interfaces';

export class Parrot extends Animal implements ICanWalk, ICanFly, ICanSing {
  readonly species = 'Папуга';

  walk(): void {
    if (!this.canAct()) throw new Error(`${this.name} не може ходити - не живий`);
  }

  fly(): void {
    if (!this.canAct())      throw new Error(`${this.name} не може літати - не живий`);
    if (!this.canRunOrFly()) throw new Error(`${this.name} не може літати - голодний`);
  }

  sing(): void {
    if (!this.canAct())      throw new Error(`${this.name} не може співати - не живий`);
    if (!this.canRunOrFly()) throw new Error(`${this.name} не може співати - голодний`);
  }
}
