import {
  readFavorites,
  removeFavorite as removeStoredFavorite,
  type FavoriteExercise,
} from '../../services/favorites-storage';

export type { FavoriteExercise } from '../../services/favorites-storage';

export const FAVORITES_PER_PAGE = 10;
export const FAVORITES_PER_PAGE_MOBILE = 8;

export interface FavoritesPageState {
  items: FavoriteExercise[];
  page: number;
  totalPages: number;
  total: number;
}

export class FavoritesModel {
  private page = 1;
  private pageSize = FAVORITES_PER_PAGE;

  getFavorites(): FavoriteExercise[] | null {
    return readFavorites();
  }

  removeFavorite(id: string): FavoriteExercise[] {
    return removeStoredFavorite(id);
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  setPage(page: number): void {
    this.page = page;
  }

  getPageState(): FavoritesPageState {
    const favorites = this.getFavorites() ?? [];
    const total = favorites.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    this.page = Math.min(Math.max(1, this.page), totalPages);

    const start = (this.page - 1) * this.pageSize;
    const items = favorites.slice(start, start + this.pageSize);

    return { items, page: this.page, totalPages, total };
  }
}
