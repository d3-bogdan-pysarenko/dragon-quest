import {
  BodyPart,
  Equipment,
  MuscleGroup,
  type ExerciseDetails,
  type ExerciseResponse,
  yourEnergyClient,
} from '../../../api';

export class ExercisesModel {
  private exercises: ExerciseResponse[] = [];
  private selectedExercise: ExerciseDetails | null = null;

  getItems(): ExerciseResponse[] {
    return this.exercises;
  }

  getSelected(): ExerciseDetails | null {
    return this.selectedExercise;
  }

  async loadList(): Promise<ExerciseResponse[]> {
    const response = await yourEnergyClient.getExercises({
      bodypart: BodyPart.BACK,
      muscles: MuscleGroup.LATS,
      equipment: Equipment.BARBELL,
      keyword: 'pull',
      page: 1,
      limit: 10,
    });

    this.exercises = response.results;
    return this.exercises;
  }

  async loadDetails(exerciseId: string): Promise<ExerciseDetails> {
    const response = await yourEnergyClient.getExerciseById(exerciseId);

    this.selectedExercise = response;
    return response;
  }
}
