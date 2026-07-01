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
}
