
export class SubscriptionView {
  private readonly emailInputElement: HTMLInputElement;
  private readonly subscribeButtonElement: HTMLButtonElement;

  constructor(
    private readonly root: HTMLFormElement
  ) {
    this.emailInputElement = this.getElement<HTMLInputElement>('#subscribe-email');
    this.subscribeButtonElement = this.getElement<HTMLButtonElement>('#subscribe-form button[type="submit"]');
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    return element;
  }

  onSubscribe(handler: (email: string) => void): void {
    this.root.addEventListener('submit', (event) => {
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