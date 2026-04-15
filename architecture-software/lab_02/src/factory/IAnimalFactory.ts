import { Animal } from '../models/Animal';

export interface IAnimalFactory {
  create(name: string, startHours: number): Animal;
}
