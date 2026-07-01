const EMPTY_TEXT =
  "It appears that you haven't added any exercises to your favorites yet. To " +
  'get started, you can add exercises that you like to your favorites for ' +
  'easier access in the future.';

export class FavoritesView {
  private readonly list: HTMLUListElement;

  constructor(private readonly root: HTMLElement) {
    this.list = this.getElement('.favor-exercises-list');
  }

  renderEmptyState(): void {
    this.root.classList.add('favor-exercises-noitems');

    const text = document.createElement('p');
    text.className = 'favor-exercises-text';
    text.textContent = EMPTY_TEXT;
    this.list.append(text);
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }
}
