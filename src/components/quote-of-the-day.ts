import { getQuoteOfTheDay } from '../api';

export const initQuoteOfTheDay = async (): Promise<void> => {
  const root = document.querySelector<HTMLElement>('[data-quote]');
  const quoteText = root?.querySelector<HTMLElement>('[data-role="quote-text"]');
  const quoteAuthor = root?.querySelector<HTMLElement>('[data-role="quote-author"]');

  if (!root || !quoteText || !quoteAuthor) {
    return;
  }

  try {
    const { quote, author } = await getQuoteOfTheDay();
    quoteText.textContent = quote;
    quoteAuthor.textContent = author;
  } catch {
    quoteText.textContent = 'Unable to load the quote of the day.';
    quoteAuthor.textContent = '';
  }
};
