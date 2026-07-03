import { ExerciseFilter } from '../../api';
import { ExercisesModel } from './exercises.model';
import { ExercisesView } from './exercises.view';

export class ExercisesController {
  constructor(
    private readonly model: ExercisesModel,
    private readonly view: ExercisesView
  ) {}

  async init(): Promise<void> {
    this.view.renderExerciseCategories();
    this.bindEvents();

    this.view.setActiveFilter(ExerciseFilter.MUSCLES);
    await this.loadCategories(ExerciseFilter.MUSCLES);
  }

  private bindEvents(): void {
    this.view.onFilterClick(filter => {
      void this.loadCategories(filter);
    });

    this.view.onCategoryCardClick(category => {
      void this.selectCategory(category);
    });

    this.view.onSearchSubmit(keyword => {
      void this.searchExercises(keyword);
    });

    this.view.onSearchClear(() => {
      void this.searchExercises('');
    });

    this.view.onPageClick(page => {
      void this.setPage(page);
    });
  }

  private async loadCategories(filter: ExerciseFilter): Promise<void> {
    await this.runRequest(() => this.model.loadCategories(filter));
  }

  private async selectCategory(category: string): Promise<void> {
    await this.runRequest(() => this.model.selectCategory(category));
  }

  private async searchExercises(keyword: string): Promise<void> {
    await this.runRequest(() => this.model.searchExercises(keyword));
  }

  private async setPage(page: number): Promise<void> {
    await this.runRequest(() => this.model.setPage(page));
    this.view.scrollToSectionTop();
  }

  private async runRequest(request: () => Promise<unknown>): Promise<void> {
    this.view.setLoading(true);

    try {
      await request();
      this.render();
    } catch (error) {
      this.view.renderError(error);
    } finally {
      this.view.setLoading(false);
    }
  }

  private render(): void {
    const state = this.model.getState();

    this.view.setActiveFilter(state.selectedFilter);

    if (state.selectedCategory) {
      this.view.renderExercises(state);
    } else {
      this.view.renderCategoryCards(state.categories);
    }

    this.view.renderPagination(state);
  }
}
