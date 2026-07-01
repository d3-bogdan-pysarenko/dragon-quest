
import { initRatingModal } from './mvc/rating/rating.controller';
import { QuoteModel } from './mvc/quote/quote.model';
import { QuoteView } from './mvc/quote/quote.view';
import { QuoteController } from './mvc/quote/quote.controller';

initRatingModal();

const quoteRoot = document.querySelector<HTMLElement>('[data-quote]');
if (quoteRoot) {
  const quoteController = new QuoteController(
    new QuoteModel(),
    new QuoteView(quoteRoot)
  );
  quoteController.init();
}
import { showLoader, hideLoader } from './components/loader';
import { initBurgerMenu } from './components/burger-menu';
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
initBurgerMenu();

export {};
