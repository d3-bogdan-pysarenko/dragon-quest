import { createModal } from '../../components/modal';
import { FAVORITES_CHANGED_EVENT } from '../../constants';
import { ExerciseModalModel } from './exercise-modal.model';
import { ExerciseModalView } from './exercise-modal.view';

export const initExerciseModal = (): void => {
  const root = document.querySelector<HTMLElement>('[data-exercise-modal]');

  if (!root) {
    return;
  }

  const model = new ExerciseModalModel();
  const view = new ExerciseModalView(root);

  const modal = createModal(root, {
    onClose: () => model.reset(),
  });

  view.onFavoriteClick(() => {
    const state = model.toggleFavorite();
    view.updateFavoriteButton(state.isFavorite);
    document.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  });

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-exercise-open]'
    );

    if (!trigger) {
      return;
    }

    const exerciseId = trigger.dataset.exerciseId ?? '';

    if (!exerciseId) {
      return;
    }

    void (async () => {
      modal.open();
      view.render({
        status: 'loading',
        exercise: null,
        isFavorite: false,
        errorMessage: null,
      });
      const state = await model.load(exerciseId);
      view.render(state);
    })();
  });
};
