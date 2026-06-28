import { FiltersModel } from './filters.model';
import { YourEnergyView } from '../../your-energy.view';

export class FiltersController {
  constructor(
    private readonly model: FiltersModel,
    private readonly view: YourEnergyView
  ) {}

  getItems() {
    return this.model.getItems();
  }

  async load(): Promise<void> {
    const filters = await this.model.load();
    this.view.renderFilters(filters);
  }
}
