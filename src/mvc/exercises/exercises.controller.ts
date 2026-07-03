import { ExerciseFilter } from '../../api';
import {
  EXERCISES_PER_PAGE,
  EXERCISES_PER_PAGE_MOBILE,
  ExercisesModel,
} from './exercises.model';
import { ExercisesView } from './exercises.view';

const DESKTOP_QUERY = '(min-width: 768px)';

export class ExercisesController {
  private readonly desktopQuery = window.matchMedia(DESKTOP_QUERY);

  constructor(
    private readonly model: ExercisesModel,
    private readonly view: ExercisesView
  ) {}

  async init(): Promise<void> {
    this.applyExercisesPerPage();
    this.view.renderExerciseCategories();
    this.bindEvents();

    this.view.setActiveFilter(ExerciseFilter.MUSCLES);
    await this.loadCategories(ExerciseFilter.MUSCLES);
  }

  private applyExercisesPerPage(): void {
    this.model.setExercisesPerPage(
      this.desktopQuery.matches ? EXERCISES_PER_PAGE : EXERCISES_PER_PAGE_MOBILE
    );
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

    this.desktopQuery.addEventListener('change', () => {
      this.applyExercisesPerPage();

      if (this.model.getState().selectedCategory) {
        void this.setPage(1);
      }
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
