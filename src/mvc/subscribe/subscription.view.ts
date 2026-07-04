import { getRequiredElement } from '../../utils';

export class SubscriptionView {
  private readonly emailInputElement: HTMLInputElement;
  private readonly subscribeButtonElement: HTMLButtonElement;

  constructor(private readonly root: HTMLFormElement) {
    this.emailInputElement = getRequiredElement(
      this.root,
      '#subscribe-email'
    );
    this.subscribeButtonElement = getRequiredElement(
      this.root,
      'button[type="submit"]'
    );
  }

  onSubscribe(handler: (email: string) => void): void {
    this.root.addEventListener('submit', event => {
      event.preventDefault();
      handler(this.getEmailInputValue());
    });
  }

  getEmailInputValue(): string {
    return this.emailInputElement.value.trim();
  }

  resetForm(): void {
    this.root.reset();
  }

  setLoading(isLoading: boolean): void {
    this.emailInputElement.disabled = isLoading;
    this.subscribeButtonElement.disabled = isLoading;
  }

  enableSubmit(): void {
    this.subscribeButtonElement.disabled = false;
  }
}
