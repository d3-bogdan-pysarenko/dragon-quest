import {
  BodyPart,
  Equipment,
  getFilters as getFiltersApi,
  getExercises as getExercisesApi,
  ExerciseFilter,
  MuscleGroup,
  type ExerciseResponse,
  type ExercisesListParams,
  type FilterItem,
} from '../../api';

export const CATEGORIES_PER_PAGE = 12;
export const CATEGORIES_PER_PAGE_MOBILE = 9;
export const EXERCISES_PER_PAGE = 10;
export const EXERCISES_PER_PAGE_MOBILE = 8;

const isEnumValue = <T extends Record<string, string>>(
  enumObject: T,
  value: string
): value is T[keyof T] => {
  return Object.values(enumObject).includes(value);
};

export interface ExercisesState {
  selectedFilter: ExerciseFilter;
  selectedCategory: string | null;
  keyword: string;
  categories: FilterItem[];
  exercises: ExerciseResponse[];
  page: number;
  totalPages: number;
}

export class ExercisesModel {
  private categoriesPerPage = CATEGORIES_PER_PAGE;

  private exercisesPerPage = EXERCISES_PER_PAGE;

  private state: ExercisesState = {
    selectedFilter: ExerciseFilter.MUSCLES,
    selectedCategory: null,
    keyword: '',
    categories: [],
    exercises: [],
    page: 1,
    totalPages: 0,
  };

  getState(): ExercisesState {
    return this.state;
  }

  setExercisesPerPage(limit: number): void {
    this.exercisesPerPage = limit;
  }

  setCategoriesPerPage(limit: number): void {
    this.categoriesPerPage = limit;
  }

  async loadCategories(filter: ExerciseFilter): Promise<ExercisesState> {
    const isSameFilterPaging =
      filter === this.state.selectedFilter &&
      this.state.selectedCategory === null;
    const page = isSameFilterPaging ? this.state.page : 1;

    const response = await getFiltersApi({
      filter,
      page,
      limit: this.categoriesPerPage,
    });

    this.state = {
      ...this.state,
      selectedFilter: filter,
      selectedCategory: null,
      keyword: '',
      categories: response.results,
      exercises: [],
      page: Number(response.page),
      totalPages: Number(response.totalPages),
    };

    return this.state;
  }

  async selectCategory(category: string): Promise<ExercisesState> {
    this.state = {
      ...this.state,
      selectedCategory: category,
      keyword: '',
      page: 1,
    };

    return this.loadExercises();
  }

  async searchExercises(keyword: string): Promise<ExercisesState> {
    this.state = {
      ...this.state,
      keyword: keyword.trim(),
      page: 1,
    };

    return this.loadExercises();
  }

  async setPage(page: number): Promise<ExercisesState> {
    this.state = { ...this.state, page };

    if (this.state.selectedCategory) {
      return this.loadExercises();
    }

    return this.loadCategories(this.state.selectedFilter);
  }

  async loadExercises(): Promise<ExercisesState> {
    if (!this.state.selectedCategory) {
      return this.state;
    }

    const response = await getExercisesApi(this.buildExercisesParams());

    this.state = {
      ...this.state,
      exercises: response.results,
      page: Number(response.page),
      totalPages: Number(response.totalPages),
    };

    return this.state;
  }

  private buildExercisesParams(): ExercisesListParams {
    const params: ExercisesListParams = {
      keyword: this.state.keyword,
      page: this.state.page,
      limit: this.exercisesPerPage,
    };

    const category = this.getSelectedCategory();

    if (category) {
      Object.assign(params, category);
    }

    return params;
  }

  private getSelectedCategory(): Pick<
    ExercisesListParams,
    'bodypart' | 'equipment' | 'muscles'
  > | null {
    const { selectedCategory, selectedFilter } = this.state;

    if (!selectedCategory) {
      return null;
    }

    switch (selectedFilter) {
      case ExerciseFilter.BODY_PARTS:
        return isEnumValue(BodyPart, selectedCategory)
          ? { bodypart: selectedCategory }
          : null;
      case ExerciseFilter.EQUIPMENT:
        return isEnumValue(Equipment, selectedCategory)
          ? { equipment: selectedCategory }
          : null;
      case ExerciseFilter.MUSCLES:
      default:
        return isEnumValue(MuscleGroup, selectedCategory)
          ? { muscles: selectedCategory }
          : null;
    }
  }
}
