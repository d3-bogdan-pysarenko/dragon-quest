import axios from 'axios';
import { addExerciseRating, ExerciseRatingPayload } from '../../api';

export interface RatingState {
  status: 'idle' | 'submitting' | 'error';
  errorMessage: string | null;
}

export class RatingModel {
  private state: RatingState = {
    status: 'idle',
    errorMessage: null,
  };

  getState(): RatingState {
    return this.state;
  }

  async submit(exerciseId: string, payload: ExerciseRatingPayload): Promise<RatingState> {
    this.state = { status: 'submitting', errorMessage: null };

    try {
      await addExerciseRating(exerciseId, payload);
      this.state = { status: 'idle', errorMessage: null };
    } catch (error) {
      this.state = { status: 'error', errorMessage: getErrorMessage(error) };
    }

    return this.state;
  }
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;

    if (data?.message) {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
