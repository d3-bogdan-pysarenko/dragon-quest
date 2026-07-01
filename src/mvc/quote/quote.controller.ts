import { QuoteModel } from './quote.model';
import { QuoteView } from './quote.view';

export class QuoteController {
  constructor(
    private model: QuoteModel,
    private view: QuoteView
  ) {}

  async init(): Promise<void> {
    try {
      const { quote, author } = await this.model.getQuote();
      this.view.renderQuote(quote, author);
    } catch (error) {
      console.error('Error loading quote of the day:', error);
      this.view.renderError();
    }
  }
}
