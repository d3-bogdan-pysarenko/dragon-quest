import { buildParams, yourEnergyApi } from './your-energy.client';
import type {
  ExerciseDetails,
  ExerciseRatingPayload,
  ExerciseRatingResponse,
  ExercisesListParams,
  ExercisesResponse,
  FilterListParams,
  FiltersResponse,
  QuoteOfTheDay,
  SubscriptionPayload,
  SubscriptionResponse,
} from './your-energy.types';

export const getFilters = async (
  params: FilterListParams = {}
): Promise<FiltersResponse> => {
  const response = await yourEnergyApi.get<FiltersResponse>('/filters', {
    params: buildParams(params),
  });

  return response.data;
};

export const getExercises = async (
  params: ExercisesListParams = {}
): Promise<ExercisesResponse> => {
  const response = await yourEnergyApi.get<ExercisesResponse>('/exercises', {
    params: buildParams(params),
  });

  return response.data;
};

export const getExerciseById = async (
  exerciseId: string
): Promise<ExerciseDetails> => {
  const response = await yourEnergyApi.get<ExerciseDetails>(
    `/exercises/${exerciseId}`
  );

  return response.data;
};

export const addExerciseRating = async (
  exerciseId: string,
  payload: ExerciseRatingPayload
): Promise<ExerciseRatingResponse> => {
  const response = await yourEnergyApi.patch<ExerciseRatingResponse>(
    `/exercises/${exerciseId}/rating`,
    payload
  );

  return response.data;
};

export const getQuoteOfTheDay = async (): Promise<QuoteOfTheDay> => {
  const response = await yourEnergyApi.get<QuoteOfTheDay>('/quote');

  return response.data;
};

export const subscribeToNewsletter = async (
  payload: SubscriptionPayload
): Promise<SubscriptionResponse> => {
  const response = await yourEnergyApi.post<SubscriptionResponse>(
    '/subscription',
    payload
  );

  return response.data;
};

export const yourEnergyClient = {
  getFilters,
  getExercises,
  getExerciseById,
  addExerciseRating,
  getQuoteOfTheDay,
  subscribeToNewsletter,
};
