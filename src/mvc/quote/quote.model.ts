import {
  getQuoteOfTheDay as getQuoteOfTheDayApi,
  type QuoteOfTheDay,
} from '../../api';

export class QuoteModel {
  async getQuote(): Promise<QuoteOfTheDay> {
    return getQuoteOfTheDayApi();
  }
}
