export interface FavoriteExercise {
  _id: string;
  name: string;
  burnedCalories: number;
  bodyPart: string;
  target: string;
}

const STORAGE_KEY = 'favorite-exercises-list';

export const readFavorites = (): FavoriteExercise[] | null => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    return Array.isArray(parsed) ? (parsed as FavoriteExercise[]) : null;
  } catch {
    return null;
  }
};

export const getFavorites = (): FavoriteExercise[] => readFavorites() ?? [];

export const saveFavorites = (favorites: FavoriteExercise[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const removeFavorite = (id: string): FavoriteExercise[] => {
  const updated = getFavorites().filter(favorite => favorite._id !== id);

  saveFavorites(updated);

  return updated;
};

export const isFavorite = (id: string): boolean => {
  return getFavorites().some(favorite => favorite._id === id);
};

export const toggleFavorite = (
  exercise: FavoriteExercise
): { favorites: FavoriteExercise[]; isFavorite: boolean } => {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(favorite => {
    return favorite._id === exercise._id;
  });

  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push(exercise);
  }

  saveFavorites(favorites);

  return {
    favorites,
    isFavorite: existingIndex < 0,
  };
};
