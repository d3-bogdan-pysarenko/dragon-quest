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

const CATEGORIES_PER_PAGE = 12;
const EXERCISES_PER_PAGE = 10;

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

  async loadCategories(filter: ExerciseFilter): Promise<ExercisesState> {
    const isSameFilterPaging =
      filter === this.state.selectedFilter &&
      this.state.selectedCategory === null;
    const page = isSameFilterPaging ? this.state.page : 1;

    const response = await getFiltersApi({
      filter,
      page,
      limit: CATEGORIES_PER_PAGE,
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
      limit: EXERCISES_PER_PAGE,
    };

    switch (this.state.selectedFilter) {
      case ExerciseFilter.BODY_PARTS:
        params.bodypart = this.state.selectedCategory as BodyPart;
        break;
      case ExerciseFilter.EQUIPMENT:
        params.equipment = this.state.selectedCategory as Equipment;
        break;
      case ExerciseFilter.MUSCLES:
      default:
        params.muscles = this.state.selectedCategory as MuscleGroup;
        break;
    }

    return params;
  }
}
