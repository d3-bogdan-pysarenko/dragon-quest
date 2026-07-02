import {
  ExerciseFilter,
  type ExerciseResponse,
  type FilterItem,
} from '../../api';
import type { ExercisesState } from './exercises.model';

export class ExercisesView {
  private readonly searchContainer: HTMLElement;
  private readonly searchForm: HTMLFormElement;
  private readonly searchInput: HTMLInputElement;
  private readonly exercisesSlash: HTMLSpanElement;
  private readonly selectedCategoryText: HTMLElement;
  private readonly listContainer: HTMLElement;
  private readonly categoriesContainer: HTMLUListElement;

  constructor(private readonly root: HTMLElement) {
    this.searchContainer = this.getElement('[data-exercises-search]');
    this.searchForm = this.getElement('[data-exercises-search] .search-form');
    this.searchInput = this.getElement('[data-exercises-search] .search-input');
    this.exercisesSlash = this.getElement('[data-exercises-slash]');
    this.selectedCategoryText = this.getElement(
      '[data-exercises-selected-category]'
    );
    this.listContainer = this.getElement('[data-exercises-list]');
    this.categoriesContainer = this.getElement('[data-exercises-categories]');
  }

  renderExerciseCategories(): void {
    this.categoriesContainer.innerHTML = Object.values(ExerciseFilter)
      .map(
        categoryName => `
        <li class="exercises-category">
          <button
            class="category-btn btnFilters"
            type="button"
            data-filter="${categoryName}"
            aria-pressed="false"
          >
            ${categoryName}
          </button>
        </li>
      `
      )
      .join('');
  }

  onFilterClick(callback: (filter: ExerciseFilter) => void): void {
    this.categoriesContainer.addEventListener('click', event => {
      const button = this.getClosestElement<HTMLButtonElement>(
        event.target,
        '[data-filter]'
      );

      if (!button) {
        return;
      }

      callback(button.dataset.filter as ExerciseFilter);
    });
  }

  onCategoryCardClick(callback: (category: string) => void): void {
    this.listContainer.addEventListener('click', event => {
      const category = this.getCategoryFromEvent(event.target);

      if (category) {
        callback(category);
      }
    });

    this.listContainer.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const category = this.getCategoryFromEvent(event.target);

      if (!category) {
        return;
      }

      event.preventDefault();
      callback(category);
    });
  }

  onSearchSubmit(callback: (keyword: string) => void): void {
    this.searchForm.addEventListener('submit', event => {
      event.preventDefault();
      callback(this.searchInput.value);
    });
  }

  onSearchClear(callback: () => void): void {
    const clearButton =
      this.searchForm.querySelector<HTMLButtonElement>('.input-btn-clear');

    clearButton?.addEventListener('click', () => {
      if (this.searchInput.value === '') {
        return;
      }

      this.searchInput.value = '';
      callback();
      this.searchInput.focus();
    });
  }

  renderCategoryCards(filters: FilterItem[]): void {
    this.showCategoriesMode();
    this.listContainer.innerHTML = '';

    if (filters.length === 0) {
      this.renderMessage('No categories were found for this filter.');
      return;
    }

    this.listContainer.innerHTML = filters
      .map(filter => this.createCategoryCard(filter))
      .join('');
  }

  renderExercises(state: ExercisesState): void {
    this.showExercisesMode(state);
    this.listContainer.innerHTML = '';

    if (state.exercises.length === 0) {
      this.renderMessage('No exercises were found for this request.');
      return;
    }

    this.listContainer.innerHTML = state.exercises
      .map(exercise => this.createWorkoutCard(exercise))
      .join('');
  }

  setActiveFilter(filter: ExerciseFilter): void {
    this.categoriesContainer
      .querySelectorAll<HTMLButtonElement>('[data-filter]')
      .forEach(button => {
        const isActive = button.dataset.filter === filter;

        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
  }

  setLoading(isLoading: boolean): void {
    this.root.setAttribute('aria-busy', String(isLoading));

    this.root
      .querySelectorAll<HTMLButtonElement>('button')
      .forEach(button => {
        button.disabled = isLoading;
      });

    this.searchInput.disabled = isLoading;
  }

  renderError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown error';

    this.renderMessage(`Sorry, something went wrong. ${message}`);
  }

  private showCategoriesMode(): void {
    this.searchContainer.classList.add('hidden');
    this.exercisesSlash.classList.add('hidden');
    this.selectedCategoryText.classList.add('hidden');
    this.selectedCategoryText.textContent = '';
    this.searchInput.value = '';
    this.listContainer.classList.remove('exercises-list--workouts');
  }

  private showExercisesMode(state: ExercisesState): void {
    this.searchContainer.classList.remove('hidden');
    this.exercisesSlash.classList.remove('hidden');
    this.selectedCategoryText.classList.remove('hidden');
    this.selectedCategoryText.textContent = state.selectedCategory
      ? this.formatDisplayName(state.selectedCategory)
      : '';
    this.searchInput.value = state.keyword;
    this.listContainer.classList.add('exercises-list--workouts');
  }

  private renderMessage(message: string): void {
    this.listContainer.innerHTML = `
      <li class="exercises-message">${this.escapeHtml(message)}</li>
    `;
  }

  private createWorkoutCard(exercise: ExerciseResponse): string {
    const rating = Number.isFinite(exercise.rating)
      ? exercise.rating.toFixed(1)
      : '0.0';

    return `
      <li class="exercises-workout-item">
        <div class="workout-card" data-workout-id="${this.escapeHtml(exercise._id)}">
          <div class="workout-header">
            <div class="workout-badge-wrap">
              <div class="workout-badge">Workout</div>
              <div class="workout-rating" aria-label="Rating ${rating}">
                <span>${rating}</span>
                <svg class="workout-rating-icon" width="18" height="18">
                  <use href="img/sprite.svg#icon-star"></use>
                </svg>
              </div>
            </div>

            <button
              class="workout-btn-start"
              type="button"
              aria-label="Start ${this.escapeHtml(exercise.name)}"
              data-action="start"
              data-exercise-id="${this.escapeHtml(exercise._id)}"
            >
              Start
              <svg class="btn-icon" width="20" height="20">
                <use href="img/sprite.svg#icon-arrow-right"></use>
              </svg>
            </button>
          </div>

          <div class="workout-title-container">
            <div class="workout-icon-wrap">
              <svg class="workout-icon" width="16" height="16">
                <use href="img/sprite.svg#icon-running-stick-figure"></use>
              </svg>
            </div>
            <h3 class="workout-title">${this.escapeHtml(this.formatDisplayName(exercise.name))}</h3>
          </div>

          <ul class="workout-info-list">
            <li class="workout-info-item">
              <span class="info-label">Burned calories:</span>
              <span class="info-value">${exercise.burnedCalories} / 3 min</span>
            </li>
            <li class="workout-info-item">
              <span class="info-label">Body part:</span>
              <span class="info-value">${this.escapeHtml(this.formatDisplayName(exercise.bodyPart))}</span>
            </li>
            <li class="workout-info-item">
              <span class="info-label">Target:</span>
              <span class="info-value">${this.escapeHtml(this.formatDisplayName(exercise.target))}</span>
            </li>
          </ul>
        </div>
      </li>
    `;
  }

  private createCategoryCard(filter: FilterItem): string {
    const categoryName = this.formatDisplayName(filter.name);
    const imageUrl = filter.imgUrl ?? filter.imgURL ?? '';

    return `
      <li
        class="exercises-item"
        data-category-name="${this.escapeHtml(filter.name)}"
        role="button"
        tabindex="0"
        aria-label="Show ${this.escapeHtml(categoryName)} exercises"
      >
        <img
          class="item-image"
          src="${this.escapeHtml(imageUrl)}"
          alt="${this.escapeHtml(filter.name)}"
        />
        <div class="item-content">
          <h3 class="content-title">${this.escapeHtml(categoryName)}</h3>
          <p class="content-description">${this.escapeHtml(filter.filter)}</p>
        </div>
      </li>
    `;
  }

  private getCategoryFromEvent(target: EventTarget | null): string | null {
    const card = this.getClosestElement<HTMLElement>(
      target,
      '[data-category-name]'
    );

    return card?.dataset.categoryName ?? null;
  }

  private getClosestElement<T extends HTMLElement>(
    target: EventTarget | null,
    selector: string
  ): T | null {
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    return target.closest<T>(selector);
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }

  private formatDisplayName(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private escapeHtml(value: string | number | null | undefined): string {
    return String(value ?? '').replace(
      /[&<>"']/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[char] ?? char
    );
  }
}
