import { getExerciseById } from '../../api';
import type { ExerciseResponse } from '../../api';
import { getErrorMessage } from '../../utils';

const FAVORITES_KEY = 'favorite-exercises-list';

interface FavoriteExercise {
  _id: string;
  name: string;
  burnedCalories: number;
  bodyPart: string;
  target: string;
}

export interface ExerciseModalState {
  status: 'idle' | 'loading' | 'success' | 'error';
  exercise: ExerciseResponse | null;
  isFavorite: boolean;
  errorMessage: string | null;
}

export class ExerciseModalModel {
  private state: ExerciseModalState = {
    status: 'idle',
    exercise: null,
    isFavorite: false,
    errorMessage: null,
  };

  getState(): ExerciseModalState {
    return this.state;
  }

  async load(exerciseId: string): Promise<ExerciseModalState> {
    this.state = {
      status: 'loading',
      exercise: null,
      isFavorite: false,
      errorMessage: null,
    };

    try {
      const exercise = await getExerciseById(exerciseId);
      this.state = {
        status: 'success',
        exercise,
        isFavorite: this.checkIsFavorite(exercise._id),
        errorMessage: null,
      };
    } catch (error) {
      this.state = {
        status: 'error',
        exercise: null,
        isFavorite: false,
        errorMessage: getErrorMessage(error),
      };
    }

    return this.state;
  }

  toggleFavorite(): ExerciseModalState {
    const { exercise } = this.state;

    if (!exercise) {
      return this.state;
    }

    const favorites = this.getFavorites();
    const existingIndex = favorites.findIndex(f => f._id === exercise._id);

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
    } else {
      favorites.push({
        _id: exercise._id,
        name: exercise.name,
        burnedCalories: exercise.burnedCalories,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
      });
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    this.state = { ...this.state, isFavorite: existingIndex < 0 };

    return this.state;
  }

  reset(): void {
    this.state = {
      status: 'idle',
      exercise: null,
      isFavorite: false,
      errorMessage: null,
    };
  }

  private checkIsFavorite(id: string): boolean {
    return this.getFavorites().some(f => f._id === id);
  }

  private getFavorites(): FavoriteExercise[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;

      return Array.isArray(parsed) ? (parsed as FavoriteExercise[]) : [];
    } catch {
      return [];
    }
  }
}
