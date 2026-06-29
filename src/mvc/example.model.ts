import {
  BodyPart,
  Equipment,
  ExerciseFilter,
  MuscleGroup,
  addExerciseRating,
  getExerciseById,
  getExercises,
  getFilters,
  getQuoteOfTheDay,
  subscribeToNewsletter,
  type ExerciseDetails,
  type ExerciseRatingPayload,
  type ExerciseRatingResponse,
  type ExerciseResponse,
  type ExercisesListParams,
  type ExercisesResponse,
  type FilterItem,
  type FilterListParams,
  type FiltersResponse,
  type PaginationParams,
  type QuoteOfTheDay,
  type QuoteResponse,
  type RatingRequest,
  type SubscriptionPayload,
  type SubscriptionRequest,
  type SubscriptionResponse,
} from '../api';

export interface ExampleState {
  filters: FilterItem[];
  exercises: ExerciseResponse[];
  selectedExercise: ExerciseDetails | null;
  quote: QuoteResponse | null;
  ratingResult: ExerciseRatingResponse | null;
  subscriptionResult: SubscriptionResponse | null;
  status: string;
}

export class ExampleModel {
  private state: ExampleState = {
    filters: [],
    exercises: [],
    selectedExercise: null,
    quote: null,
    ratingResult: null,
    subscriptionResult: null,
    status: 'Ready',
  };

  private readonly paginationParams: PaginationParams = {
    page: 1,
    limit: 6,
  };

  private readonly filtersParams: FilterListParams = {
    filter: ExerciseFilter.MUSCLES,
    ...this.paginationParams,
  };

  private readonly exercisesParams: ExercisesListParams = {
    bodypart: BodyPart.BACK,
    muscles: MuscleGroup.LATS,
    equipment: Equipment.BARBELL,
    keyword: 'pull',
    ...this.paginationParams,
  };

  private readonly ratingPayload: ExerciseRatingPayload = {
    rate: 5,
    email: 'student@example.com',
    review: 'MVC example rating request',
  };

  private readonly subscriptionPayload: SubscriptionPayload = {
    email: 'student@example.com',
  };

  getState(): ExampleState {
    return this.state;
  }

  async loadReadExamples(): Promise<ExampleState> {
    this.setStatus('Loading GET requests...');

    const [filtersResponse, exercisesResponse, quote] = await Promise.all([
      this.loadFilters(),
      this.loadExercises(),
      this.loadQuote(),
    ]);

    const selectedExercise = exercisesResponse.results[0]
      ? await this.loadExerciseDetails(exercisesResponse.results[0]._id)
      : null;

    this.state = {
      ...this.state,
      filters: filtersResponse.results,
      exercises: exercisesResponse.results,
      selectedExercise,
      quote,
      status: 'GET requests loaded',
    };

    return this.state;
  }

  async rateSelectedExercise(): Promise<ExampleState> {
    const selectedExerciseId = this.state.selectedExercise?._id;

    if (!selectedExerciseId) {
      this.setStatus('Load exercises before rating.');
      return this.state;
    }

    const payload: RatingRequest = this.ratingPayload;
    const ratingResult = await addExerciseRating(selectedExerciseId, payload);

    this.state = {
      ...this.state,
      ratingResult,
      status: 'PATCH rating request sent',
    };

    return this.state;
  }

  async subscribe(): Promise<ExampleState> {
    const payload: SubscriptionRequest = this.subscriptionPayload;
    const subscriptionResult = await subscribeToNewsletter(payload);

    this.state = {
      ...this.state,
      subscriptionResult,
      status: 'POST subscription request sent',
    };

    return this.state;
  }

  private async loadFilters(): Promise<FiltersResponse> {
    return getFilters(this.filtersParams);
  }

  private async loadExercises(): Promise<ExercisesResponse> {
    return getExercises(this.exercisesParams);
  }

  private async loadExerciseDetails(exerciseId: string): Promise<ExerciseDetails> {
    return getExerciseById(exerciseId);
  }

  private async loadQuote(): Promise<QuoteOfTheDay> {
    return getQuoteOfTheDay();
  }

  private setStatus(status: string): void {
    this.state = {
      ...this.state,
      status,
    };
  }
}
