import { AnimalEventArgs } from './AnimalEventArgs';
export class CleanedEventArgs extends AnimalEventArgs {
  constructor(animalName: string, species: string, readonly cleansToday: number) {
    super(animalName, species);
  }
}
