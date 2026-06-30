import { initRatingModal } from './components/rating-modal';
import { ExampleController } from './mvc/example.controller';
import { ExampleModel } from './mvc/example.model';
import { ExampleView } from './mvc/example.view';

const mvcElement = document.querySelector<HTMLElement>('[data-mvc-example]');

if (!mvcElement) {
  throw new Error('MVC example element not found');
}

const model = new ExampleModel();
const view = new ExampleView(mvcElement);
const controller = new ExampleController(model, view);

controller.init();
initRatingModal();
