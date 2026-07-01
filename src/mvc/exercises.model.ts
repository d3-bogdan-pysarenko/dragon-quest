import {
  getFilters as getFiltersApi,
  ExerciseFilter,
  FiltersResponse,
} from '../api';

export class ExercisesModel {
  async getFilters(filter: ExerciseFilter): Promise<FiltersResponse> {
    return getFiltersApi({ filter });
  }
}