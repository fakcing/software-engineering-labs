import { Animal } from '../models/Animal';
import { Cat } from '../models/Cat';
import { Parrot } from '../models/Parrot';
import { Snake } from '../models/Snake';
import { IAnimalFactory } from './IAnimalFactory';

export class CatFactory implements IAnimalFactory {
  create(name: string, startHours: number): Animal {
    return new Cat(name, startHours);
  }
}

export class ParrotFactory implements IAnimalFactory {
  create(name: string, startHours: number): Animal {
    return new Parrot(name, startHours);
  }
}

export class SnakeFactory implements IAnimalFactory {
  create(name: string, startHours: number): Animal {
    return new Snake(name, startHours);
  }
}
