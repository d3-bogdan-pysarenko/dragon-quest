import type { ExampleState } from './example.model';

export class ExampleView {
  private readonly statusElement: HTMLParagraphElement;
  private readonly filtersElement: HTMLUListElement;
  private readonly exercisesElement: HTMLUListElement;
  private readonly detailsElement: HTMLDivElement;
  private readonly quoteElement: HTMLQuoteElement;
  private readonly ratingElement: HTMLParagraphElement;
  private readonly subscriptionElement: HTMLParagraphElement;
  private readonly loadButton: HTMLButtonElement;
  private readonly ratingButton: HTMLButtonElement;
  private readonly subscribeButton: HTMLButtonElement;

  constructor(private readonly root: HTMLElement) {
    this.root.innerHTML = `
      <section class="mvc-example" aria-labelledby="mvc-example-title">
        <h2 id="mvc-example-title">MVC API example</h2>
        <p data-role="status"></p>

        <div>
          <button type="button" data-action="load">Load API data</button>
          <button type="button" data-action="rate">Send rating</button>
          <button type="button" data-action="subscribe">Subscribe</button>
        </div>

        <article>
          <h3>Filters</h3>
          <ul data-role="filters"></ul>
        </article>

        <article>
          <h3>Exercises</h3>
          <ul data-role="exercises"></ul>
        </article>

        <article>
          <h3>Exercise details</h3>
          <div data-role="details"></div>
        </article>

        <article>
          <h3>Quote</h3>
          <blockquote data-role="quote"></blockquote>
        </article>

        <article>
          <h3>Mutation results</h3>
          <p data-role="rating"></p>
          <p data-role="subscription"></p>
        </article>
      </section>
    `;

    this.statusElement = this.getElement('[data-role="status"]');
    this.filtersElement = this.getElement('[data-role="filters"]');
    this.exercisesElement = this.getElement('[data-role="exercises"]');
    this.detailsElement = this.getElement('[data-role="details"]');
    this.quoteElement = this.getElement('[data-role="quote"]');
    this.ratingElement = this.getElement('[data-role="rating"]');
    this.subscriptionElement = this.getElement('[data-role="subscription"]');
    this.loadButton = this.getElement('[data-action="load"]');
    this.ratingButton = this.getElement('[data-action="rate"]');
    this.subscribeButton = this.getElement('[data-action="subscribe"]');
  }

  render(state: ExampleState): void {
    this.statusElement.textContent = state.status;

    this.filtersElement.innerHTML = state.filters
      .map(filter => `<li>${filter.name} (${filter.filter})</li>`)
      .join('');

    this.exercisesElement.innerHTML = state.exercises
      .map(exercise => `<li>${exercise.name}: ${exercise.target}</li>`)
      .join('');

    this.detailsElement.textContent = state.selectedExercise
      ? `${state.selectedExercise.name}, ${state.selectedExercise.equipment}, ${state.selectedExercise.time} min`
      : 'No exercise selected';

    this.quoteElement.textContent = state.quote
      ? `${state.quote.quote} - ${state.quote.author}`
      : 'No quote loaded';

    this.ratingElement.textContent = state.ratingResult
      ? `Rating updated: ${state.ratingResult.name} (${state.ratingResult.rating})`
      : 'Rating request was not sent';

    this.subscriptionElement.textContent = state.subscriptionResult
      ? state.subscriptionResult.message
      : 'Subscription request was not sent';
  }

  onLoad(handler: () => void): void {
    this.loadButton.addEventListener('click', handler);
  }

  onRate(handler: () => void): void {
    this.ratingButton.addEventListener('click', handler);
  }

  onSubscribe(handler: () => void): void {
    this.subscribeButton.addEventListener('click', handler);
  }

  setLoading(isLoading: boolean): void {
    this.loadButton.disabled = isLoading;
    this.ratingButton.disabled = isLoading;
    this.subscribeButton.disabled = isLoading;
  }

  renderError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown error';

    this.statusElement.textContent = `Error: ${message}`;
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    return element;
  }
}
