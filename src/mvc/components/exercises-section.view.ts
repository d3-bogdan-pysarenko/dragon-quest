import type { ExerciseResponse } from '../../api';
import { html } from './html';

export class ExercisesSectionView {
  constructor(private readonly root: HTMLElement) {}

  bindSelect(handler: (exerciseId: string) => void): void {
    this.root.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const card = target.closest<HTMLElement>('[data-exercise-id]');

      if (!card) {
        return;
      }

      const { exerciseId } = card.dataset;

      if (exerciseId) {
        handler(exerciseId);
      }
    });
  }

  render(exercises: ExerciseResponse[]): void {
    if (exercises.length === 0) {
      this.root.innerHTML =
        '<li class="exercises__empty">No exercises found.</li>';
      return;
    }

    this.root.innerHTML = exercises
      .map(exercise =>
        html`
          <li class="exercises__item" data-exercise-id="${exercise._id}">
            <button type="button" class="exercises__button">
              <strong class="exercises__name">${exercise.name}</strong>
              <span class="exercises__meta">
                ${exercise.bodyPart} • ${exercise.equipment}
              </span>
              <span class="exercises__meta">Target: ${exercise.target}</span>
              <span class="exercises__meta">Rating: ${exercise.rating}</span>
            </button>
          </li>
        `
      )
      .join('');
  }
}
