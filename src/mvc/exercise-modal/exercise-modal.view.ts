import { getRequiredElement } from '../../utils';
import type { ExerciseModalState } from './exercise-modal.model';

export class ExerciseModalView {
  private readonly gifElement: HTMLImageElement;
  private readonly mediaElement: HTMLElement;
  private readonly nameElement: HTMLElement;
  private readonly ratingValueElement: HTMLElement;
  private readonly starsElement: HTMLElement;
  private readonly starSvgTemplate: SVGSVGElement | null | undefined;
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
    this.gifElement = getRequiredElement(
      this.root,
      '[data-role="exercise-gif"]'
    );
    this.mediaElement = getRequiredElement(
      this.root,
      '[data-role="exercise-media"]'
    );
    this.nameElement = getRequiredElement(
      this.root,
      '[data-role="exercise-name"]'
    );
    this.ratingValueElement = getRequiredElement(
      this.root,
      '[data-role="exercise-rating-value"]'
    );
    this.starsElement = getRequiredElement(
      this.root,
      '[data-role="exercise-stars"]'
    );
    this.targetElement = getRequiredElement(
      this.root,
      '[data-role="exercise-target"]'
    );
    this.bodyPartElement = getRequiredElement(
      this.root,
      '[data-role="exercise-body-part"]'
    );
    this.equipmentElement = getRequiredElement(
      this.root,
      '[data-role="exercise-equipment"]'
    );
    this.popularityElement = getRequiredElement(
      this.root,
      '[data-role="exercise-popularity"]'
    );
    this.caloriesElement = getRequiredElement(
      this.root,
      '[data-role="exercise-calories"]'
    );
    this.descriptionElement = getRequiredElement(
      this.root,
      '[data-role="exercise-description"]'
    );
    this.favoriteButton = getRequiredElement(
      this.root,
      '[data-role="exercise-favorite-btn"]'
    );
    this.favoriteBtnText = getRequiredElement(
      this.root,
      '[data-role="exercise-favorite-text"]'
    );
    this.favoriteBtnSVGUse = getRequiredElement(
      this.root,
      '[data-role="exercise-favorite-btn"] .btn-icon use'
    );
    this.ratingButton = getRequiredElement(
      this.root,
      '[data-role="exercise-rating-btn"]'
    );
    this.loadingElement = getRequiredElement(
      this.root,
      '[data-role="exercise-loading"]'
    );
    this.contentElement = getRequiredElement(
      this.root,
      '[data-role="exercise-content"]'
    );
    this.errorElement = getRequiredElement(
      this.root,
      '[data-role="exercise-error"]'
    );
    this.starSvgTemplate = document
      .querySelector<HTMLTemplateElement>('[data-exercise-modal-star-template]')
      ?.content.querySelector('svg');
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
    const basePath = this.favoriteBtnSVGUse.href.baseVal.split('#')[0];
    this.favoriteBtnSVGUse.href.baseVal = `${basePath}#${iconName}`;
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
    this.starsElement.innerHTML = '';
    this.starsElement.appendChild(this.buildStars(rating));

    this.targetElement.textContent = exercise.target;
    this.bodyPartElement.textContent = exercise.bodyPart;
    this.equipmentElement.textContent = exercise.equipment;
    this.popularityElement.textContent = String(exercise.popularity);
    this.caloriesElement.textContent = String(exercise.burnedCalories);
    this.descriptionElement.textContent = exercise.description;

    this.ratingButton.dataset.exerciseId = exercise._id;

    this.updateFavoriteButton(isFavorite);
  }

  private buildStars(rating: number): DocumentFragment {
    const filledCount = Math.round(Math.min(Math.max(rating, 0), 5));
    const fragment = document.createDocumentFragment();

    Array.from({ length: 5 }, (_, i) => {
      const filled = i < filledCount;
      const svgElement = this.starSvgTemplate?.cloneNode(true) as SVGSVGElement;
      if (!svgElement) {
        return;
      }

      if (filled) {
        svgElement.classList.add('exercise-modal-star-filled');
      }
      fragment.appendChild(svgElement);
    });
    return fragment;
  }

}
