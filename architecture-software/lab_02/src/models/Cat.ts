import { Animal } from './Animal';
import { ICanWalk, ICanRun, ICanSing } from '../interfaces';

export class Cat extends Animal implements ICanWalk, ICanRun, ICanSing {
  readonly species = 'Кіт';

  walk(): void {
    if (!this.canAct()) throw new Error(`${this.name} не може ходити - не живий`);
  }

  run(): void {
    if (!this.canAct())      throw new Error(`${this.name} не може бігати - не живий`);
    if (!this.canRunOrFly()) throw new Error(`${this.name} не може бігати - голодний`);
  }

  sing(): void {
    if (!this.canAct())      throw new Error(`${this.name} не може нявкати - не живий`);
    if (!this.canRunOrFly()) throw new Error(`${this.name} не може нявкати - голодний`);
  }
}
