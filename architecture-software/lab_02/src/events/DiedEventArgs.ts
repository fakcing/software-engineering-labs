import { AnimalEventArgs } from './AnimalEventArgs';
export class DiedEventArgs extends AnimalEventArgs {
  constructor(animalName: string, species: string, readonly reason: 'голод' | 'переїдання') {
    super(animalName, species);
  }
}
