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
}

export class ExercisesModel {
  private state: ExercisesState = {
    selectedFilter: ExerciseFilter.MUSCLES,
    selectedCategory: null,
    keyword: '',
    categories: [],
    exercises: [],
  };

  getState(): ExercisesState {
    return this.state;
  }

  async loadCategories(filter: ExerciseFilter): Promise<ExercisesState> {
    const response = await getFiltersApi({
      filter,
      page: 1,
      limit: CATEGORIES_PER_PAGE,
    });

    this.state = {
      ...this.state,
      selectedFilter: filter,
      selectedCategory: null,
      keyword: '',
      categories: response.results,
      exercises: [],
    };

    return this.state;
  }

  async selectCategory(category: string): Promise<ExercisesState> {
    this.state = {
      ...this.state,
      selectedCategory: category,
      keyword: '',
    };

    return this.loadExercises();
  }

  async searchExercises(keyword: string): Promise<ExercisesState> {
    this.state = {
      ...this.state,
      keyword: keyword.trim(),
    };

    return this.loadExercises();
  }

  async loadExercises(): Promise<ExercisesState> {
    if (!this.state.selectedCategory) {
      return this.state;
    }

    const response = await getExercisesApi(this.buildExercisesParams());

    this.state = {
      ...this.state,
      exercises: response.results,
    };

    return this.state;
  }

  private buildExercisesParams(): ExercisesListParams {
    const params: ExercisesListParams = {
      keyword: this.state.keyword,
      page: 1,
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
