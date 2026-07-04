import {
  getQuoteOfTheDay as getQuoteOfTheDayApi,
  type QuoteOfTheDay,
} from '../../api';
import { readQuote, saveQuote } from '../../services/quote-storage';

const getTodayKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export class QuoteModel {
  async getQuote(): Promise<QuoteOfTheDay> {
    const today = getTodayKey();
    const storedQuote = readQuote();

    if (storedQuote?.date === today) {
      return {
        author: storedQuote.author,
        quote: storedQuote.quote,
      };
    }

    const quote = await getQuoteOfTheDayApi();

    saveQuote({ ...quote, date: today });

    return quote;
  }
}
