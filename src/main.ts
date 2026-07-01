import { ExercisesModel } from './mvc/exercises.model';
import { ExercisesView } from './mvc/exercises.view';
import { ExercisesController } from './mvc/exercises.controller';

const exercisesSection = document.querySelector<HTMLElement>('[data-exercises-section]');
if (!exercisesSection) throw new Error('Exercises section not found');

const model = new ExercisesModel();
const view = new ExercisesView(exercisesSection);
view.renderExerciseCategories();
const controller = new ExercisesController(model, view);

controller.init();

