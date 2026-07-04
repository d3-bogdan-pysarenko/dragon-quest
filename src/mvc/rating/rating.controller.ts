import { createModal, type ModalInstance } from '../../components/modal';
import { showToast, ToastType } from '../../components/toast';
import { RatingModel } from './rating.model';
import { RatingView } from './rating.view';

export interface OpenRatingModalOptions {
  exerciseId: string;
  /** Called once the modal fully closes (any path: X, ESC, overlay, success).
   * The future exercise-detail modal should pass its re-open function here. */
  onClose?: () => void;
}

const bindRatingSubmit = (
  view: RatingView,
  model: RatingModel,
  modal: ModalInstance,
  getExerciseId: () => string
): void => {
  view.onSubmit(payload => {
    void (async () => {
      view.render({ status: 'submitting', errorMessage: null });
      const state = await model.submit(getExerciseId(), payload);
      view.render(state);

      if (state.status === 'idle') {
        modal.close();
        showToast(
          'Your rating has been submitted. Thank you!',
          ToastType.Success
        );
      } else if (state.status === 'error') {
        showToast('Something went wrong. Please try again.', ToastType.Error);
      }
    })();
  });
};

export const openRatingModal = (options: OpenRatingModalOptions): void => {
  const root = document.querySelector<HTMLElement>('[data-rating-modal]');

  if (!root) {
    return;
  }

  const modal = createModal(root, { onClose: options.onClose });
  const model = new RatingModel();
  const view = new RatingView(root);

  view.render(model.getState());
  bindRatingSubmit(view, model, modal, () => options.exerciseId);

  modal.open();
};

export const initRatingModal = (): void => {
  const root = document.querySelector<HTMLElement>('[data-rating-modal]');

  if (!root) {
    return;
  }

  let exerciseId = '';

  const modal = createModal(root, {
    onClose: () => view.reset(),
  });
  const model = new RatingModel();
  const view = new RatingView(root);

  view.render(model.getState());
  bindRatingSubmit(view, model, modal, () => exerciseId);

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-rating-open]'
    );

    if (!trigger) {
      return;
    }

    exerciseId = trigger.dataset.exerciseId ?? '';
    view.reset();
    modal.open();
  });
};
