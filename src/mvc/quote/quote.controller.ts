import type { QuoteModel } from './quote.model';
import type { QuoteView } from './quote.view';

export class QuoteController {
  constructor(
    private model: QuoteModel,
    private view: QuoteView
  ) {}

  async init(): Promise<void> {
    try {
      const { quote, author } = await this.model.getQuote();
      this.view.renderQuote(quote, author);
    } catch {
      this.view.renderError();
    }
  }
}
