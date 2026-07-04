import {
  getPageFromEvent,
  renderPagination,
} from '../../components/pagination';
import {
  formatDisplayName,
  getClosestElement,
  getRequiredElement,
} from '../../utils';
import type { FavoriteExercise } from './favorites.model';

const EMPTY_TEXT =
  "It appears that you haven't added any exercises to your favorites yet. To " +
  'get started, you can add exercises that you like to your favorites for ' +
  'easier access in the future.';

export class FavoritesView {
  private readonly exercisesBox: HTMLElement;
  private readonly list: HTMLUListElement;
  private readonly cardTemplate: HTMLTemplateElement;
  private readonly paginationContainer: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.exercisesBox = getRequiredElement(this.root, '.favor-exercises');
    this.list = getRequiredElement(this.root, '.favor-exercises-list');
    this.cardTemplate = getRequiredElement(
      this.root,
      '[data-favorites-card-template]'
    );
    this.paginationContainer = getRequiredElement(
      this.root,
      '[data-favorites-pagination]'
    );
  }

  renderFavorites(favorites: FavoriteExercise[]): void {
    this.exercisesBox.classList.remove('favor-exercises-noitems');
    this.list.innerHTML = '';

    const fragment = favorites.reduce((frag, favorite) => {
      frag.appendChild(this.createCard(favorite));
      return frag;
    }, document.createDocumentFragment());

    this.list.appendChild(fragment);
  }

  renderEmptyState(): void {
    this.list.innerHTML = '';
    this.exercisesBox.classList.add('favor-exercises-noitems');

    const text = document.createElement('p');
    text.className = 'favor-exercises-text';
    text.textContent = EMPTY_TEXT;
    this.list.append(text);
  }

  renderPagination(page: number, totalPages: number): void {
    renderPagination(this.paginationContainer, { page, totalPages });
  }

  onDeleteClick(callback: (id: string) => void): void {
    this.list.addEventListener('click', event => {
      const button = getClosestElement<HTMLElement>(
        event.target,
        '[data-action="delete"]'
      );

      if (!button) {
        return;
      }

      const id = button
        .closest<HTMLElement>('[data-workout-id]')
        ?.getAttribute('data-workout-id');

      if (id) {
        callback(id);
      }
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

  scrollToTop(): void {
    this.exercisesBox.scrollTop = 0;
    this.exercisesBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private createCard(favorite: FavoriteExercise): HTMLElement {
    const clone = this.cardTemplate.content.cloneNode(true) as HTMLElement;
    const listItem = getRequiredElement<HTMLLIElement>(clone, 'li');
    const workoutCard = getRequiredElement<HTMLElement>(
      listItem,
      '.workout-card'
    );
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
    const name = formatDisplayName(favorite.name);

    workoutCard.setAttribute('data-workout-id', favorite._id);

    startButton.setAttribute('aria-label', `Start ${name}`);
    startButton.setAttribute('data-exercise-id', favorite._id);

    workoutTitle.textContent = name;
    workoutTitle.setAttribute('title', name);

    caloriesElement.textContent = `${favorite.burnedCalories} / 3 min`;

    bodyPartElement.textContent = formatDisplayName(favorite.bodyPart);

    targetElement.textContent = formatDisplayName(favorite.target);

    return listItem;
  }
}
