import type { QuoteOfTheDay } from '../api';

const STORAGE_KEY = 'quote-of-the-day';

export interface StoredQuoteOfTheDay extends QuoteOfTheDay {
  date: string;
}

const isStoredQuote = (value: unknown): value is StoredQuoteOfTheDay => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const quote = value as Partial<StoredQuoteOfTheDay>;

  return (
    typeof quote.date === 'string' &&
    typeof quote.author === 'string' &&
    typeof quote.quote === 'string'
  );
};

export const readQuote = (): StoredQuoteOfTheDay | null => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    return isStoredQuote(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveQuote = (quote: StoredQuoteOfTheDay): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
};
