import { ExerciseFilter } from '../../api';

export class ExercisesView {
  private readonly searchInput: HTMLInputElement;
  private readonly exercisesTitleText: HTMLElement;
  private readonly exercisesSlash: HTMLSpanElement;
  private readonly listItems: HTMLElement;
  private categoriesContainer: HTMLUListElement;

  constructor(private readonly root: HTMLElement) {
    this.searchInput = this.getElement('[data-exercises-search]');
    this.exercisesTitleText = this.getElement('[data-exercises-title-text]');
    this.exercisesSlash = this.getElement('[data-exercises-slash]');
    this.listItems = this.getElement('[data-exercises-list]');
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