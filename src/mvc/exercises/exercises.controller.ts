import { ExerciseFilter } from '../../api';
import { ExercisesModel } from './exercises.model';
import { ExercisesView } from './exercises.view';

export class ExercisesController {
  constructor(
    private model: ExercisesModel,
    private view: ExercisesView
  ) {}

  init(): void {
    this.view.renderExerciseCategories();
    this.view.onCategoryClick(filter => this.handleFilterSelection(filter));
    this.view.setDefaultCategory(ExerciseFilter.MUSCLES);
  }

  private async handleFilterSelection(filter: ExerciseFilter): Promise<void> {
    try {
      const data = await this.model.getFilters(filter);
      console.log(data.results);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  }
}