export class QuoteView {
  private readonly quoteText: HTMLElement;
  private readonly quoteAuthor: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.quoteText = this.getElement('[data-role="quote-text"]');
    this.quoteAuthor = this.getElement('[data-role="quote-author"]');
  }

  renderQuote(quote: string, author: string): void {
    this.quoteText.textContent = quote;
    this.quoteAuthor.textContent = author;
  }

  renderError(): void {
    this.quoteText.textContent = 'Unable to load the quote of the day.';
    this.quoteAuthor.textContent = '';
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }
}
