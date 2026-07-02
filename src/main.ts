import { initScrollUp } from './components/scroll-up';
import { showLoader, hideLoader } from './components/loader';
import { initBurgerMenu } from './components/burger-menu';
import { initRatingModal } from './mvc/rating/rating.controller';
import { QuoteModel } from './mvc/quote/quote.model';
import { QuoteView } from './mvc/quote/quote.view';
import { QuoteController } from './mvc/quote/quote.controller';
import './components/svg-icon-sun'
import { FavoritesModel } from './mvc/favorites/favorites.model';
import { FavoritesView } from './mvc/favorites/favorites.view';
import { FavoritesController } from './mvc/favorites/favorites.controller';
import { ExercisesModel } from './mvc/exercises/exercises.model';
import { ExercisesView } from './mvc/exercises/exercises.view';
import { ExercisesController } from './mvc/exercises/exercises.controller';
import {
  SubscriptionController, SubscriptionModel, SubscriptionView
} from './mvc/subscribe';

initRatingModal();
initScrollUp();
initBurgerMenu();

const favoritesRoot = document.querySelector<HTMLElement>('[data-favorites]');
if (favoritesRoot) {
  const favoritesController = new FavoritesController(
    new FavoritesModel(),
    new FavoritesView(favoritesRoot)
  );
  favoritesController.init();
}

const quoteRoot = document.querySelector<HTMLElement>('[data-quote]');
if (quoteRoot) {
  const quoteController = new QuoteController(
    new QuoteModel(),
    new QuoteView(quoteRoot)
  );
  quoteController.init();
}

const exercisesSection = document.querySelector<HTMLElement>(
  '[data-exercises-section]'
);
if (exercisesSection) {
  const exercisesController = new ExercisesController(
    new ExercisesModel(),
    new ExercisesView(exercisesSection)
  );

  void exercisesController.init();
}

const subscriptionForm = document.querySelector<HTMLFormElement>(
  '[data-subscribe-form]'
);
if (subscriptionForm) {
  const subscriptionController = new SubscriptionController(
    new SubscriptionModel(),
    new SubscriptionView(subscriptionForm)
  );
  subscriptionController.init();
}

showLoader();
hideLoader();

export { };
