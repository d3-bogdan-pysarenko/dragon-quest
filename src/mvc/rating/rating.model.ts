import { addExerciseRating, ExerciseRatingPayload } from '../../api';
import { getErrorMessage } from '../../utils';

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
