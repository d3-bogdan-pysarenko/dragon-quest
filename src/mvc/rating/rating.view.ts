import type { ExerciseRatingPayload } from '../../api';
import type { RatingState } from './rating.model';

export class RatingView {
  private readonly form: HTMLFormElement;
  private readonly ratingValueElement: HTMLElement;
  private readonly submitButton: HTMLButtonElement;
  private readonly errorElement: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.form = this.getElement('[data-role="rating-form"]');
    this.ratingValueElement = this.getElement('[data-role="rating-value"]');
    this.submitButton = this.getElement('[data-role="rating-submit"]');
    this.errorElement = this.getElement('[data-role="rating-error"]');

    this.form.addEventListener('change', event => {
      if ((event.target as HTMLElement).matches('[name="rate"]')) {
        const checked = this.form.querySelector<HTMLInputElement>(
          '[name="rate"]:checked'
        );
        this.ratingValueElement.textContent = checked
          ? Number(checked.value).toFixed(1)
          : '0.0';
      }
    });
  }

  render(state: RatingState): void {
    const isSubmitting = state.status === 'submitting';

    this.submitButton.disabled = isSubmitting;
    this.submitButton.textContent = isSubmitting ? 'Sending...' : 'Send';

    if (state.errorMessage) {
      this.errorElement.textContent = state.errorMessage;
      this.errorElement.hidden = false;
    } else {
      this.errorElement.textContent = '';
      this.errorElement.hidden = true;
    }
  }

  onSubmit(handler: (payload: ExerciseRatingPayload) => void): void {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }

      const data = new FormData(this.form);

      handler({
        rate: Number(data.get('rate')),
        email: String(data.get('email')),
        review: String(data.get('review')),
      });
    });
  }

  reset(): void {
    this.form.reset();
    this.ratingValueElement.textContent = '0.0';
    this.errorElement.textContent = '';
    this.errorElement.hidden = true;
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    return element;
  }
}
