import { Animal } from "./Animal";
import { ICanWalk, ICanFly, ICanTalk } from "../interfaces";

export class Parrot extends Animal implements ICanWalk, ICanFly, ICanTalk {
  readonly species = "Папуга";

  walk(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може ходити - не живий`);
    }
  }

  fly(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може літати - не живий`);
    }
    if (!this.canRunOrFly()) {
      throw new Error(`${this.name} не може літати - голодний`);
    }
  }

  talk(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може говорити - не живий`);
    }
  }
}
