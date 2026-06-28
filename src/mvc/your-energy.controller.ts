import { YourEnergyView } from './your-energy.view';
import { ExercisesController } from './features/exercises/exercises.controller';
import { FiltersController } from './features/filters/filters.controller';
import { QuoteController } from './features/quote/quote.controller';
import { UiStateController } from './features/ui-state/ui-state.controller';

export class YourEnergyController {
  constructor(
    private readonly view: YourEnergyView,
    private readonly filtersController: FiltersController,
    private readonly exercisesController: ExercisesController,
    private readonly quoteController: QuoteController,
    private readonly uiStateController: UiStateController
  ) {}

  init(): void {
    this.bindEvents();
    void this.loadInitialData();
  }

  private bindEvents(): void {
    this.view.bindAction('reload-all', () => {
      void this.loadInitialData();
    });
    this.view.bindAction('reload-filters', () => {
      void this.loadFilters();
    });
    this.view.bindAction('reload-exercises', () => {
      void this.loadExercises();
    });
    this.view.bindAction('reload-quote', () => {
      void this.loadQuote();
    });
    this.exercisesController.bindEvents();
  }

  private async loadInitialData(): Promise<void> {
    this.startLoading('Loading dashboard...');

    try {
      await Promise.all([
        this.filtersController.load(),
        this.exercisesController.loadList(),
        this.quoteController.load(),
      ]);

      const [firstExercise] = this.exercisesController.getItems();

      if (firstExercise) {
        await this.exercisesController.loadDetails(firstExercise._id);
      }

      this.finishLoading('Dashboard loaded');
    } catch (error) {
      this.handleError(error, 'Failed to load dashboard');
    }
  }

  private async loadFilters(): Promise<void> {
    this.startLoading('Loading filters...');

    try {
      await this.filtersController.load();
      this.finishLoading('Filters loaded');
    } catch (error) {
      this.handleError(error, 'Failed to load filters');
    }
  }

  private async loadExercises(): Promise<void> {
    this.startLoading('Loading exercises...');

    try {
      await this.exercisesController.loadList();
      this.finishLoading('Exercises loaded');
    } catch (error) {
      this.handleError(error, 'Failed to load exercises');
    }
  }

  private async loadQuote(): Promise<void> {
    this.startLoading('Loading quote...');

    try {
      await this.quoteController.load();
      this.finishLoading('Quote loaded');
    } catch (error) {
      this.handleError(error, 'Failed to load quote');
    }
  }

  private async loadExerciseDetails(exerciseId: string): Promise<void> {
    this.startLoading('Loading exercise details...');

    try {
      await this.exercisesController.loadDetails(exerciseId);
      this.finishLoading('Exercise details loaded');
    } catch (error) {
      this.handleError(error, 'Failed to load exercise details');
    }
  }

  private startLoading(message: string): void {
    this.uiStateController.startLoading(message);
  }

  private finishLoading(message: string): void {
    this.uiStateController.finishLoading(message);
  }

  private handleError(error: unknown, message: string): void {
    const text = error instanceof Error ? error.message : message;

    this.uiStateController.setError(text);
    console.error(message, error);
  }
}
