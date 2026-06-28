import { YourEnergyController } from './mvc/your-energy.controller';
import { YourEnergyView } from './mvc/your-energy.view';
import { ExercisesController } from './mvc/features/exercises/exercises.controller';
import { ExercisesModel } from './mvc/features/exercises/exercises.model';
import { FiltersController } from './mvc/features/filters/filters.controller';
import { FiltersModel } from './mvc/features/filters/filters.model';
import { QuoteController } from './mvc/features/quote/quote.controller';
import { QuoteModel } from './mvc/features/quote/quote.model';
import { UiStateController } from './mvc/features/ui-state/ui-state.controller';
import { UiStateModel } from './mvc/features/ui-state/ui-state.model';

const mainElement = document.querySelector('main');

if (!mainElement) {
  throw new Error('Main element not found');
}

const view = new YourEnergyView(mainElement);
const filtersModel = new FiltersModel();
const exercisesModel = new ExercisesModel();
const quoteModel = new QuoteModel();
const uiStateModel = new UiStateModel();

const filtersController = new FiltersController(filtersModel, view);
const exercisesController = new ExercisesController(exercisesModel, view);
const quoteController = new QuoteController(quoteModel, view);
const uiStateController = new UiStateController(uiStateModel, view);

const controller = new YourEnergyController(
  view,
  filtersController,
  exercisesController,
  quoteController,
  uiStateController
);

controller.init();

export {
  controller,
  exercisesController,
  exercisesModel,
  filtersController,
  filtersModel,
  quoteController,
  quoteModel,
  uiStateController,
  uiStateModel,
  view,
};
