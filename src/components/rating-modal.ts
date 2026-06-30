import { createModal } from './modal';

export const initRatingModal = (): void => {
  const root = document.querySelector<HTMLElement>('[data-rating-modal]');
  const form = root?.querySelector<HTMLFormElement>('[data-role="rating-form"]');
  const ratingValue = root?.querySelector<HTMLElement>('[data-role="rating-value"]');

  if (!root || !form || !ratingValue) {
    return;
  }

  const modal = createModal(root);

  const updateRatingValue = (): void => {
    const checked = form.querySelector<HTMLInputElement>('[name="rate"]:checked');
    ratingValue.textContent = checked ? Number(checked.value).toFixed(1) : '0.0';
  };

  form.addEventListener('change', event => {
    if ((event.target as HTMLElement).matches('[name="rate"]')) {
      updateRatingValue();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Next step: read FormData + exerciseId here and call addExerciseRating via MVC.
    form.reset();
    updateRatingValue();
    modal.close();
  });

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-rating-open]');

    if (!trigger) {
      return;
    }

    form.dataset.exerciseId = trigger.dataset.exerciseId ?? '';
    modal.open();
  });
};
