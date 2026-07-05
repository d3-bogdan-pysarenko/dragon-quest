import {
  ExerciseFilter,
  type ExerciseResponse,
  type FilterItem,
} from '../../api';
import {
  getPageFromEvent,
  renderPagination,
} from '../../components/pagination';
import {
  formatDisplayName,
  getErrorMessage,
  getRequiredElement,
} from '../../utils';
import type { ExercisesState } from './exercises.model';

export class ExercisesView {
  private readonly searchContainer: HTMLElement;
  private readonly searchForm: HTMLFormElement;
  private readonly searchInput: HTMLInputElement;
  private readonly exercisesSlash: HTMLSpanElement;
  private readonly selectedCategoryText: HTMLElement;
  private readonly listContainer: HTMLElement;
  private readonly listItemTemplate: HTMLTemplateElement;
  private readonly categoriesContainer: HTMLUListElement;
  private readonly paginationContainer: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.searchContainer = getRequiredElement(
      this.root,
      '[data-exercises-search]'
    );
    this.searchForm = getRequiredElement(
      this.root,
      '[data-exercises-search] .search-form'
    );
    this.searchInput = getRequiredElement(
      this.root,
      '[data-exercises-search] .search-input'
    );
    this.exercisesSlash = getRequiredElement(
      this.root,
      '[data-exercises-slash]'
    );
    this.selectedCategoryText = getRequiredElement(
      this.root,
      '[data-exercises-selected-category]'
    );
    this.listContainer = getRequiredElement(this.root, '[data-exercises-list]');
    this.listItemTemplate = getRequiredElement(
      this.root,
      '[data-exercises-workout-item-template]'
    );
    this.categoriesContainer = getRequiredElement(
      this.root,
      '[data-exercises-categories]'
    );
    this.paginationContainer = getRequiredElement(
      this.root,
      '[data-exercises-pagination]'
    );
  }

  renderExerciseCategories(): void {
    const filterOrder = [
      ExerciseFilter.MUSCLES,
      ExerciseFilter.BODY_PARTS,
      ExerciseFilter.EQUIPMENT,
    ];

    this.categoriesContainer.innerHTML = filterOrder
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

  onPageClick(callback: (page: number) => void): void {
    this.paginationContainer.addEventListener('click', event => {
      const page = getPageFromEvent(event.target);

      if (page !== null) {
        callback(page);
      }
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

    const fragment = state.exercises.reduce((frag, exercise) => {
      frag.appendChild(this.createWorkoutCard(exercise));
      return frag;
    }, document.createDocumentFragment());
    this.listContainer.appendChild(fragment);
  }

  renderPagination(state: ExercisesState): void {
    renderPagination(this.paginationContainer, {
      page: state.page,
      totalPages: state.totalPages,
    });
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
      .querySelectorAll<HTMLButtonElement>('button:not([data-static-disabled])')
      .forEach(button => {
        button.disabled = isLoading;
      });

    this.searchInput.disabled = isLoading;
  }

  scrollToSectionTop(): void {
    this.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  renderError(error: unknown): void {
    const message = getErrorMessage(error);

    this.renderMessage(`Sorry, something went wrong. ${message}`);
  }

  private showCategoriesMode(): void {
    this.searchContainer.classList.add('hidden');
    this.exercisesSlash.classList.add('hidden');
    this.selectedCategoryText.classList.add('hidden');
    this.selectedCategoryText.textContent = '';
    this.searchInput.value = '';
    this.listContainer.classList.remove('exercises-list-workouts');
  }

  private showExercisesMode(state: ExercisesState): void {
    this.searchContainer.classList.remove('hidden');
    this.exercisesSlash.classList.remove('hidden');
    this.selectedCategoryText.classList.remove('hidden');
    this.selectedCategoryText.textContent = state.selectedCategory
      ? formatDisplayName(state.selectedCategory)
      : '';
    this.searchInput.value = state.keyword;
    this.listContainer.classList.add('exercises-list-workouts');
  }

  private renderMessage(message: string): void {
    this.listContainer.innerHTML = `
      <li class="exercises-message">${this.escapeHtml(message)}</li>
    `;
  }

  private createWorkoutCard(exercise: ExerciseResponse): HTMLElement {
    const rating = Number.isFinite(exercise.rating)
      ? exercise.rating.toFixed(1)
      : '0.0';

    const clone: HTMLElement = this.listItemTemplate.content.cloneNode(
      true
    ) as HTMLElement;
    const listItem = getRequiredElement<HTMLLIElement>(clone, 'li');
    const workoutCard = getRequiredElement<HTMLElement>(
      listItem,
      '.workout-card'
    );
    const ratingElement = getRequiredElement<HTMLElement>(
      listItem,
      '.workout-rating'
    );
    const ratingText = getRequiredElement<HTMLElement>(ratingElement, 'span');
    const startButton = getRequiredElement<HTMLButtonElement>(
      listItem,
      '.workout-btn-start'
    );
    const workoutTitle = getRequiredElement<HTMLElement>(
      listItem,
      '.workout-title'
    );
    const caloriesElement = getRequiredElement<HTMLElement>(
      listItem,
      '[data-exercise-burned-calories]'
    );
    const bodyPartElement = getRequiredElement<HTMLElement>(
      listItem,
      '[data-exercise-body-part]'
    );
    const targetElement = getRequiredElement<HTMLElement>(
      listItem,
      '[data-exercise-target]'
    );

    workoutCard.setAttribute('data-workout-id', this.escapeHtml(exercise._id));

    ratingElement.setAttribute('aria-label', `Rating ${rating}`);

    ratingText.textContent = rating;

    startButton.setAttribute(
      'aria-label',
      `Start ${this.escapeHtml(exercise.name)}`
    );

    startButton.setAttribute('data-exercise-id', this.escapeHtml(exercise._id));

    const exerciseName = formatDisplayName(exercise.name);
    workoutTitle.textContent = exerciseName;
    workoutTitle.setAttribute('title', exerciseName);

    caloriesElement.textContent = `${exercise.burnedCalories} / 3 min`;

    bodyPartElement.textContent = formatDisplayName(exercise.bodyPart);

    targetElement.textContent = formatDisplayName(exercise.target);

    return listItem;
  }

  private createCategoryCard(filter: FilterItem): string {
    const categoryName = formatDisplayName(filter.name);
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
          loading="lazy"
          decoding="async"
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
