import type { QuoteResponse } from '../../api';
import { html } from './html';

export class QuoteSectionView {
  constructor(private readonly root: HTMLElement) {}

  render(quote: QuoteResponse | null): void {
    if (!quote) {
      this.root.textContent = 'No quote loaded yet.';
      return;
    }

    this.root.innerHTML = html`
      <blockquote class="quote-card__text">"${quote.quote}"</blockquote>
      <p class="quote-card__author">${quote.author}</p>
    `;
  }
}
