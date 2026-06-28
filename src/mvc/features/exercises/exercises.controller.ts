import { ExercisesModel } from './exercises.model';
import { YourEnergyView } from '../../your-energy.view';

export class ExercisesController {
  constructor(
    private readonly model: ExercisesModel,
    private readonly view: YourEnergyView
  ) {}

  bindEvents(): void {
    this.view.bindExerciseSelect(exerciseId => {
      void this.loadDetails(exerciseId);
    });
  }

  getItems() {
    return this.model.getItems();
  }

  getSelected() {
    return this.model.getSelected();
  }

  async loadList(): Promise<void> {
    const exercises = await this.model.loadList();
    this.view.renderExercises(exercises);
  }

  async loadDetails(exerciseId: string): Promise<void> {
    const exercise = await this.model.loadDetails(exerciseId);
    this.view.renderExerciseDetails(exercise);
  }
}
