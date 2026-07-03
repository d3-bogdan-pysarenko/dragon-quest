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
import { Endpoint } from '../constants';

export const getFilters = async (
  params: FilterListParams = {}
): Promise<FiltersResponse> => {
  const response = await yourEnergyApi.get<FiltersResponse>(Endpoint.Filters, {
    params: buildParams(params),
  });

  return response.data;
};

export const getExercises = async (
  params: ExercisesListParams = {}
): Promise<ExercisesResponse> => {
  const response = await yourEnergyApi.get<ExercisesResponse>(
    Endpoint.Exercises,
    {
      params: buildParams(params),
    }
  );

  return response.data;
};

export const getExerciseById = async (
  exerciseId: string
): Promise<ExerciseDetails> => {
  const response = await yourEnergyApi.get<ExerciseDetails>(
    `${Endpoint.Exercises}/${exerciseId}`
  );

  return response.data;
};

export const addExerciseRating = async (
  exerciseId: string,
  payload: ExerciseRatingPayload
): Promise<ExerciseRatingResponse> => {
  const response = await yourEnergyApi.patch<ExerciseRatingResponse>(
    `${Endpoint.Exercises}/${exerciseId}/${Endpoint.Rating}`,
    payload
  );

  return response.data;
};

export const getQuoteOfTheDay = async (): Promise<QuoteOfTheDay> => {
  const response = await yourEnergyApi.get<QuoteOfTheDay>(Endpoint.Quote);

  return response.data;
};

export const subscribeToNewsletter = async (
  payload: SubscriptionPayload
): Promise<SubscriptionResponse> => {
  const response = await yourEnergyApi.post<SubscriptionResponse>(
    Endpoint.Subscription,
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
