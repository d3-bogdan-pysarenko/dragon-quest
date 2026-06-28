import type { QuoteResponse } from '../../../api';
import { yourEnergyClient } from '../../../api';

export class QuoteModel {
  private quote: QuoteResponse | null = null;

  getItem(): QuoteResponse | null {
    return this.quote;
  }

  async load(): Promise<QuoteResponse> {
    const response = await yourEnergyClient.getQuoteOfTheDay();

    this.quote = response;
    return response;
  }
}
