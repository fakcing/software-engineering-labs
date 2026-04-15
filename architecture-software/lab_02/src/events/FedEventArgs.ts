import { AnimalEventArgs } from './AnimalEventArgs';
export class FedEventArgs extends AnimalEventArgs {
  constructor(animalName: string, species: string, readonly mealsToday: number) {
    super(animalName, species);
  }
}
