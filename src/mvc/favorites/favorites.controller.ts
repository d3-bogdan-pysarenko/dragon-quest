import { FavoritesModel } from './favorites.model';
import { FavoritesView } from './favorites.view';

export class FavoritesController {
  constructor(
    private model: FavoritesModel,
    private view: FavoritesView
  ) {}

  init(): void {
    const favorites = this.model.getFavorites();
    if (!favorites || favorites.length === 0) {
      this.view.renderEmptyState();
    }
  }
}
