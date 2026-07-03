import type { ExerciseModalState } from './exercise-modal.model';

export class ExerciseModalView {
  private readonly gifElement: HTMLImageElement;
  private readonly mediaElement: HTMLElement;
  private readonly nameElement: HTMLElement;
  private readonly ratingValueElement: HTMLElement;
  private readonly starsElement: HTMLElement;
  private readonly targetElement: HTMLElement;
  private readonly bodyPartElement: HTMLElement;
  private readonly equipmentElement: HTMLElement;
  private readonly popularityElement: HTMLElement;
  private readonly caloriesElement: HTMLElement;
  private readonly descriptionElement: HTMLElement;
  private readonly favoriteButton: HTMLButtonElement;
  private readonly favoriteBtnText: HTMLElement;
  private readonly favoriteBtnSVGUse: SVGUseElement;
  private readonly ratingButton: HTMLButtonElement;
  private readonly loadingElement: HTMLElement;
  private readonly contentElement: HTMLElement;
  private readonly errorElement: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.gifElement = this.getElement<HTMLImageElement>(
      '[data-role="exercise-gif"]'
    );
    this.mediaElement = this.getElement('[data-role="exercise-media"]');
    this.nameElement = this.getElement('[data-role="exercise-name"]');
    this.ratingValueElement = this.getElement(
      '[data-role="exercise-rating-value"]'
    );
    this.starsElement = this.getElement('[data-role="exercise-stars"]');
    this.targetElement = this.getElement('[data-role="exercise-target"]');
    this.bodyPartElement = this.getElement('[data-role="exercise-body-part"]');
    this.equipmentElement = this.getElement('[data-role="exercise-equipment"]');
    this.popularityElement = this.getElement(
      '[data-role="exercise-popularity"]'
    );
    this.caloriesElement = this.getElement('[data-role="exercise-calories"]');
    this.descriptionElement = this.getElement(
      '[data-role="exercise-description"]'
    );
    this.favoriteButton = this.getElement<HTMLButtonElement>(
      '[data-role="exercise-favorite-btn"]'
    );
    this.favoriteBtnText = this.getElement(
      '[data-role="exercise-favorite-text"]'
    );
    this.favoriteBtnSVGUse = this.getElement(
      '[data-role="exercise-favorite-btn"] .btn-icon use'
    );
    this.ratingButton = this.getElement<HTMLButtonElement>(
      '[data-role="exercise-rating-btn"]'
    );
    this.loadingElement = this.getElement('[data-role="exercise-loading"]');
    this.contentElement = this.getElement('[data-role="exercise-content"]');
    this.errorElement = this.getElement('[data-role="exercise-error"]');
  }

  render(state: ExerciseModalState): void {
    switch (state.status) {
      case 'loading':
        this.showLoading();
        break;
      case 'error':
        this.showError(
          state.errorMessage ?? 'Something went wrong. Please try again.'
        );
        break;
      case 'success':
        if (state.exercise) {
          this.showContent(state);
        }
        break;
      default:
        break;
    }
  }

  onFavoriteClick(handler: () => void): void {
    this.favoriteButton.addEventListener('click', handler);
  }

  onRatingClick(handler: () => void): void {
    this.ratingButton.addEventListener('click', handler);
  }

  updateFavoriteButton(isFavorite: boolean): void {
    this.favoriteBtnText.textContent = isFavorite
      ? 'Remove from favorites'
      : 'Add to favorites';
    const iconName = isFavorite ? 'icon-trash' : 'icon-heart';
    this.favoriteBtnSVGUse.href.baseVal = `img/sprite.svg#${iconName}`;
  }

  private showLoading(): void {
    this.loadingElement.hidden = false;
    this.contentElement.hidden = true;
    this.errorElement.hidden = true;
  }

  private showError(message: string): void {
    this.loadingElement.hidden = true;
    this.errorElement.textContent = message;
    this.errorElement.hidden = false;
    this.contentElement.hidden = true;
  }

  private showContent(state: ExerciseModalState): void {
    const { exercise, isFavorite } = state;

    if (!exercise) {
      return;
    }

    this.loadingElement.hidden = true;
    this.errorElement.hidden = true;
    this.contentElement.hidden = false;

    if (exercise.gifUrl) {
      this.gifElement.src = exercise.gifUrl;
      this.gifElement.alt = exercise.name;
      this.mediaElement.hidden = false;
    } else {
      this.mediaElement.hidden = true;
    }

    this.nameElement.textContent = exercise.name;

    const rating = Number.isFinite(exercise.rating) ? exercise.rating : 0;

    this.ratingValueElement.textContent = rating.toFixed(1);
    this.starsElement.innerHTML = this.buildStars(rating);

    this.targetElement.textContent = exercise.target;
    this.bodyPartElement.textContent = exercise.bodyPart;
    this.equipmentElement.textContent = exercise.equipment;
    this.popularityElement.textContent = String(exercise.popularity);
    this.caloriesElement.textContent = String(exercise.burnedCalories);
    this.descriptionElement.textContent = exercise.description;

    this.ratingButton.dataset.exerciseId = exercise._id;

    this.updateFavoriteButton(isFavorite);
  }

  private buildStars(rating: number): string {
    const filledCount = Math.round(Math.min(Math.max(rating, 0), 5));

    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < filledCount;
      return `<svg class="exercise-modal-star${filled ? ' exercise-modal-star--filled' : ''}" width="18" height="18" aria-hidden="true"><use href="img/sprite.svg#icon-star"></use></svg>`;
    }).join('');
  }

  private getElement<T extends HTMLElement | SVGUseElement>(
    selector: string
  ): T | never {
    const element: T | null = this.root.querySelector<T>(selector);

    if (!element) {
      throw new Error(`ExerciseModalView: element not found: ${selector}`);
    }

    return element;
  }
}
