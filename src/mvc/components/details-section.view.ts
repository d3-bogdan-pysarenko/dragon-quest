import type { ExerciseDetails } from '../../api';
import { html } from './html';

export class DetailsSectionView {
  constructor(private readonly root: HTMLElement) {}

  render(exercise: ExerciseDetails | null): void {
    if (!exercise) {
      this.root.textContent = 'Select an exercise to load details.';
      return;
    }

    this.root.innerHTML = html`
      <article class="details-card">
        <h3 class="details-card__title">${exercise.name}</h3>
        <p class="details-card__description">${exercise.description}</p>
        <ul class="details-card__list">
          <li>Body part: ${exercise.bodyPart}</li>
          <li>Equipment: ${exercise.equipment}</li>
          <li>Target: ${exercise.target}</li>
          <li>Calories: ${exercise.burnedCalories}</li>
          <li>Time: ${exercise.time} min</li>
          <li>Popularity: ${exercise.popularity}</li>
          <li>Rating: ${exercise.rating}</li>
        </ul>
      </article>
    `;
  }
}
