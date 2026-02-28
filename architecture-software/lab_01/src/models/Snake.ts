import { Animal } from "./Animal";
import { ICanCrawl, ICanTalk } from "../interfaces";

export class Snake extends Animal implements ICanCrawl, ICanTalk {
  readonly species = "Змія";

  crawl(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може повзати - не живий`);
    }
  }

  talk(): void {
    if (!this.canAct()) {
      throw new Error(`${this.name} не може говорити - не живий`);
    }
  }
}
