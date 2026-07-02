import { FavoritesModel } from './favorites.model';
import { FavoritesView } from './favorites.view';

export class FavoritesController {
  constructor(
    private model: FavoritesModel,
    private view: FavoritesView
  ) {}

  init(): void {
    this.render();

    this.view.onDeleteClick(id => {
      const remaining = this.model.removeFavorite(id);
      this.render(remaining);
    });
  }

  private render(favorites = this.model.getFavorites()): void {
    if (!favorites || favorites.length === 0) {
      this.view.renderEmptyState();
      return;
    }

    this.view.renderFavorites(favorites);
  }
}
