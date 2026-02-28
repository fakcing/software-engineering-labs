import { Animal } from "./Animal";
import { ICanWalk, ICanRun, ICanTalk } from "../interfaces";

export class Cat extends Animal implements ICanWalk, ICanRun, ICanTalk {
  readonly species = "Кіт";

  walk(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може ходити - не живий`);
    }
  }

  run(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може бігати - не живий`);
    }
    if (!this.canRunOrFly()) {
      throw new Error(`${this.name} не може бігати - голодний`);
    }
  }

  talk(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може говорити - не живий`);
    }
  }
}
