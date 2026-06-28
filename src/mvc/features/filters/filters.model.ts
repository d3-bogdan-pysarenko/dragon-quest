import { ExerciseFilter, type FilterItem, yourEnergyClient } from '../../../api';

export class FiltersModel {
  private filters: FilterItem[] = [];

  getItems(): FilterItem[] {
    return this.filters;
  }

  async load(): Promise<FilterItem[]> {
    const response = await yourEnergyClient.getFilters({
      filter: ExerciseFilter.MUSCLES,
      page: 1,
      limit: 12,
    });

    this.filters = response.results;
    return this.filters;
  }
}
