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

interface RatingModalContext {
  modal: ModalInstance;
  model: RatingModel;
  view: RatingView;
  setExerciseId(exerciseId: string): void;
  setCloseHandler(handler: (() => void) | undefined): void;
}

let ratingModalContext: RatingModalContext | null = null;

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

const getRatingModalContext = (): RatingModalContext | null => {
  const root = document.querySelector<HTMLElement>('[data-rating-modal]');

  if (!root) {
    return null;
  }

  if (ratingModalContext) {
    return ratingModalContext;
  }

  let exerciseId = '';
  let closeHandler: (() => void) | undefined;

  const model = new RatingModel();
  const view = new RatingView(root);
  const modal = createModal(root, {
    onClose: () => {
      view.reset();
      closeHandler?.();
      closeHandler = undefined;
    },
  });

  view.render(model.getState());
  bindRatingSubmit(view, model, modal, () => exerciseId);

  ratingModalContext = {
    modal,
    model,
    view,
    setExerciseId(nextExerciseId: string): void {
      exerciseId = nextExerciseId;
    },
    setCloseHandler(handler: (() => void) | undefined): void {
      closeHandler = handler;
    },
  };

  return ratingModalContext;
};

export const openRatingModal = (options: OpenRatingModalOptions): void => {
  const context = getRatingModalContext();

  if (!context) {
    return;
  }

  context.setExerciseId(options.exerciseId);
  context.setCloseHandler(options.onClose);
  context.view.reset();
  context.modal.open();
};

export const initRatingModal = (): void => {
  const context = getRatingModalContext();

  if (!context) {
    return;
  }

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-rating-open]'
    );

    if (!trigger) {
      return;
    }

    context.setExerciseId(trigger.dataset.exerciseId ?? '');
    context.setCloseHandler(undefined);
    context.view.reset();
    context.modal.open();
  });
};
