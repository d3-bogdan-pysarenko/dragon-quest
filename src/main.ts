import { initRatingModal } from './mvc/rating/rating.controller';
import { showLoader, hideLoader } from './components/loader';
import { ExercisesModel } from './mvc/exercises/exercises.model';
import { ExercisesView } from './mvc/exercises/exercises.view';
import { ExercisesController } from './mvc/exercises/exercises.controller';

const exercisesSection = document.querySelector<HTMLElement>(
  '[data-exercises-section]'
);
if (!exercisesSection) throw new Error('Exercises section not found');
const exercisesModel = new ExercisesModel();
const exercisesView = new ExercisesView(exercisesSection);
exercisesView.renderExerciseCategories();
const exercisesController = new ExercisesController(
  exercisesModel,
  exercisesView
);
exercisesController.init();

showLoader();
hideLoader();

initRatingModal();

export {};
