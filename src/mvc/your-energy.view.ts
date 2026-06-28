import type {
  ExerciseDetails,
  ExerciseResponse,
  FilterItem,
  QuoteResponse,
} from '../api';
import type { UiStatusVariant } from './features/ui-state/ui-state.model';
import { DetailsSectionView } from './components/details-section.view';
import { ExercisesSectionView } from './components/exercises-section.view';
import { FiltersSectionView } from './components/filters-section.view';
import { QuoteSectionView } from './components/quote-section.view';
import { StatusView } from './components/status.view';

export class YourEnergyView {
  private readonly statusView: StatusView;
  private readonly quoteSectionView: QuoteSectionView;
  private readonly filtersSectionView: FiltersSectionView;
  private readonly exercisesSectionView: ExercisesSectionView;
  private readonly detailsSectionView: DetailsSectionView;

  constructor(private readonly root: HTMLElement) {
    const status = this.root.querySelector<HTMLElement>('[data-role="status"]');
    const quote = this.root.querySelector<HTMLElement>('[data-role="quote"]');
    const filters = this.root.querySelector<HTMLElement>('[data-role="filters"]');
    const exercises =
      this.root.querySelector<HTMLElement>('[data-role="exercises"]');
    const details = this.root.querySelector<HTMLElement>('[data-role="details"]');

    if (!status || !quote || !filters || !exercises || !details) {
      throw new Error('Your Energy view markup is incomplete');
    }

    this.statusView = new StatusView(status);
    this.quoteSectionView = new QuoteSectionView(quote);
    this.filtersSectionView = new FiltersSectionView(filters);
    this.exercisesSectionView = new ExercisesSectionView(exercises);
    this.detailsSectionView = new DetailsSectionView(details);
  }

  bindAction(action: string, handler: () => void): void {
    const button = this.root.querySelector<HTMLButtonElement>(
      `[data-action="${action}"]`
    );

    button?.addEventListener('click', handler);
  }

  bindExerciseSelect(handler: (exerciseId: string) => void): void {
    this.exercisesSectionView.bindSelect(handler);
  }

  setStatus(message: string, variant: UiStatusVariant = 'idle'): void {
    this.statusView.render(message, variant);
  }

  renderQuote(quote: QuoteResponse | null): void {
    this.quoteSectionView.render(quote);
  }

  renderFilters(filters: FilterItem[]): void {
    this.filtersSectionView.render(filters);
  }

  renderExercises(exercises: ExerciseResponse[]): void {
    this.exercisesSectionView.render(exercises);
  }

  renderExerciseDetails(exercise: ExerciseDetails | null): void {
    this.detailsSectionView.render(exercise);
  }
}
