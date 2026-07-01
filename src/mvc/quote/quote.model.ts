import { getQuoteOfTheDay as getQuoteOfTheDayApi, QuoteOfTheDay } from '../../api';

export class QuoteModel {
  async getQuote(): Promise<QuoteOfTheDay> {
    return getQuoteOfTheDayApi();
  }
}
