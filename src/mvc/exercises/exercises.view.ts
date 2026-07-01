import { ExerciseFilter, FilterItem } from '../../api';

export class ExercisesView {
  private readonly searchInput: HTMLInputElement;
  private readonly exercisesTitleText: HTMLElement;
  private readonly exercisesSlash: HTMLSpanElement;
  private readonly listContainer: HTMLElement;
  private categoriesContainer: HTMLUListElement;

  constructor(private readonly root: HTMLElement) {
    this.searchInput = this.getElement('[data-exercises-search]');
    this.exercisesTitleText = this.getElement('[data-exercises-title-text]');
    this.exercisesSlash = this.getElement('[data-exercises-slash]');
    this.listContainer = this.getElement('[data-exercises-list]');
    this.categoriesContainer = this.getElement('[data-exercises-categories]');
  }

  renderExerciseCategories(): void {
    this.categoriesContainer.innerHTML = Object.values(ExerciseFilter)
      .map(categoryName => `
        <li class="exercises-category">
          <button class="category-btn btnFilters" type="button" data-filter="${categoryName}">
            ${categoryName}
          </button>
        </li>
      `).join('');
  }

  onCategoryClick(callback: (filter: ExerciseFilter) => void): void {
    const buttons = this.categoriesContainer.querySelectorAll('.btnFilters');
    const buttonList = Array.from(buttons) as HTMLButtonElement[];

    if (buttonList.length === 0) return;

    buttonList.forEach(button => {
      button.addEventListener('click', () => {
        buttonList.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        callback(button.textContent?.trim() as ExerciseFilter);
      });
    });
  }

  hideElements(): void {
    this.searchInput.classList.add('hidden');
    this.exercisesTitleText.classList.add('hidden');
    this.exercisesSlash.classList.add('hidden');
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }

  renderCategoryCard(filters: FilterItem[]) {
    const template = document.getElementById('filter-card-template') as HTMLTemplateElement;

    if (!template) return;
    this.listContainer.innerHTML = '';

    filters.forEach(filter => {
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const card = clone.querySelector('.filter-item') as HTMLElement;

        (card.querySelector('[data-filter-img]') as HTMLImageElement).src = filter.imgUrl;
        (card.querySelector('[data-filter-img]') as HTMLImageElement).alt = filter.name;
        (card.querySelector('[data-filter-title]') as HTMLElement).textContent = filter.filter;
        (card.querySelector('[data-filter-desc]') as HTMLElement).textContent = filter.name;

        card.addEventListener('click', () => this.handleCardClick(filter.filter));

        this.listContainer.appendChild(clone);
      },
    );
  }

  private handleCardClick(filter: ExerciseFilter) { }

  setDefaultCategory(categoryName: ExerciseFilter) {
    const button = Array.from(this.categoriesContainer.querySelectorAll('.btnFilters'))
      .find(btn => btn.textContent?.trim() === categoryName);

    if (button) {
      this.categoriesContainer.querySelectorAll('.btnFilters')
        .forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    }
  }
}
