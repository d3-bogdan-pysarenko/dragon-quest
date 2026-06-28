import { QuoteModel } from './quote.model';
import { YourEnergyView } from '../../your-energy.view';

export class QuoteController {
  constructor(
    private readonly model: QuoteModel,
    private readonly view: YourEnergyView
  ) {}

  getItem() {
    return this.model.getItem();
  }

  async load(): Promise<void> {
    const quote = await this.model.load();
    this.view.renderQuote(quote);
  }
}
