import { AnimalEventArgs } from './AnimalEventArgs';
export class HungryEventArgs extends AnimalEventArgs {
  constructor(animalName: string, species: string, readonly hoursSinceLastMeal: number) {
    super(animalName, species);
  }
}
