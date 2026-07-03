export interface FavoriteExercise {
  _id: string;
  name: string;
  burnedCalories: number;
  bodyPart: string;
  target: string;
}

const STORAGE_KEY = 'favorite-exercises-list';

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as FavoriteExercise[]) : null;
    } catch {
      return null;
    }
  }

  removeFavorite(id: string): FavoriteExercise[] {
    const favorites = this.getFavorites() ?? [];
    const updated = favorites.filter(favorite => favorite._id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return updated;
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
