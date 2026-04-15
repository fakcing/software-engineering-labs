import { AnimalEventArgs } from './AnimalEventArgs';
export class HappinessChangedEventArgs extends AnimalEventArgs {
  constructor(animalName: string, species: string, readonly isHappy: boolean) {
    super(animalName, species);
  }
}
