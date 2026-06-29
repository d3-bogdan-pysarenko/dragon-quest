import type { FilterItem } from '../../api';
import { html } from './html';

export class FiltersSectionView {
  constructor(private readonly root: HTMLElement) {}

  render(filters: FilterItem[]): void {
    if (filters.length === 0) {
      this.root.innerHTML = '<li class="filters__empty">No filters found.</li>';
      return;
    }

    this.root.innerHTML = filters
      .map(filter =>
        html`
          <li class="filters__item">
            <span class="filters__name">${filter.name}</span>
            <small class="filters__meta">${filter.filter}</small>
          </li>
        `
      )
      .join('');
  }
}
