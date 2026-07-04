import { getExerciseById } from '../../api';
import type { ExerciseResponse } from '../../api';
import {
  isFavorite,
  toggleFavorite,
  type FavoriteExercise,
} from '../../services/favorites-storage';
import { getErrorMessage } from '../../utils';

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
        isFavorite: isFavorite(exercise._id),
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

    const result = toggleFavorite(this.toFavoriteExercise(exercise));
    this.state = { ...this.state, isFavorite: result.isFavorite };

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

  private toFavoriteExercise(exercise: ExerciseResponse): FavoriteExercise {
    return {
      _id: exercise._id,
      name: exercise.name,
      burnedCalories: exercise.burnedCalories,
      bodyPart: exercise.bodyPart,
      target: exercise.target,
    };
  }
}
