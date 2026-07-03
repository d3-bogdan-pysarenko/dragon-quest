export interface FavoriteExercise {
  _id: string;
  name: string;
  burnedCalories: number;
  bodyPart: string;
  target: string;
}

const STORAGE_KEY = 'favorite-exercises-list';

export class FavoritesModel {
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
}
