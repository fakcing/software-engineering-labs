import { Animal } from './Animal';
import { ICanWalk, ICanCrawl } from '../interfaces';

export class Snake extends Animal implements ICanWalk, ICanCrawl {
  readonly species = 'Змія';

  walk(): void {
    if (!this.canAct()) throw new Error(`${this.name} не може ходити - не живий`);
  }

  crawl(): void {
    if (!this.canAct()) throw new Error(`${this.name} не може повзати - не живий`);
  }
}
