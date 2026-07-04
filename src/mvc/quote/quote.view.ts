import { getRequiredElement } from '../../utils';

export class QuoteView {
  private readonly quoteText: HTMLElement;
  private readonly quoteAuthor: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.quoteText = getRequiredElement(
      this.root,
      '[data-role="quote-text"]'
    );
    this.quoteAuthor = getRequiredElement(
      this.root,
      '[data-role="quote-author"]'
    );
  }

  renderQuote(quote: string, author: string): void {
    this.quoteText.textContent = quote;
    this.quoteAuthor.textContent = author;
  }

  renderError(): void {
    this.quoteText.textContent = 'Unable to load the quote of the day.';
    this.quoteAuthor.textContent = '';
  }
}
