export enum ExerciseFilter {
  BODY_PARTS = 'Body parts',
  MUSCLES = 'Muscles',
  EQUIPMENT = 'Equipment',
}

export enum BodyPart {
  BACK = 'back',
  CARDIO = 'cardio',
  CHEST = 'chest',
  LOWER_ARMS = 'lower arms',
  LOWER_LEGS = 'lower legs',
  NECK = 'neck',
  SHOULDERS = 'shoulders',
  UPPER_ARMS = 'upper arms',
  UPPER_LEGS = 'upper legs',
  WAIST = 'waist',
}

export enum MuscleGroup {
  ABDUCTORS = 'abductors',
  ABS = 'abs',
  ADDUCTORS = 'adductors',
  BICEPS = 'biceps',
  CALVES = 'calves',
  CARDIOVASCULAR_SYSTEM = 'cardiovascular system',
  DELTS = 'delts',
  FOREARMS = 'forearms',
  GLUTES = 'glutes',
  HAMSTRINGS = 'hamstrings',
  LATS = 'lats',
  LEVATOR_SCAPULAE = 'levator scapulae',
  PECTORALS = 'pectorals',
  QUADS = 'quads',
  SERRATUS_ANTERIOR = 'serratus anterior',
  SPINE = 'spine',
  TRAPS = 'traps',
  TRICEPS = 'triceps',
  UPPER_BACK = 'upper back',
}

export enum Equipment {
  ASSISTED = 'assisted',
  BAND = 'band',
  BARBELL = 'barbell',
  BODY_WEIGHT = 'body weight',
  BOSU_BALL = 'bosu ball',
  CABLE = 'cable',
  DUMBBELL = 'dumbbell',
  ELLIPTICAL_MACHINE = 'elliptical machine',
  EZ_BARBELL = 'ez barbell',
  HAMMER = 'hammer',
  KETTLEBELL = 'kettlebell',
  LEVERAGE_MACHINE = 'leverage machine',
  MEDICINE_BALL = 'medicine ball',
  OLYMPIC_BARBELL = 'olympic barbell',
  RESISTANCE_BAND = 'resistance band',
  ROLLER = 'roller',
  ROPE = 'rope',
  SKIERG_MACHINE = 'skierg machine',
  SLED_MACHINE = 'sled machine',
  SMITH_MACHINE = 'smith machine',
  STABILITY_BALL = 'stability ball',
  STATIONARY_BIKE = 'stationary bike',
  STEPMILL_MACHINE = 'stepmill machine',
  TIRE = 'tire',
  TRAP_BAR = 'trap bar',
  UPPER_BODY_ERGOMETER = 'upper body ergometer',
  WEIGHTED = 'weighted',
  WHEEL_ROLLER = 'wheel roller',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterListParams extends PaginationParams {
  filter?: ExerciseFilter;
}

export interface ExercisesListParams extends PaginationParams {
  bodypart?: BodyPart;
  muscles?: MuscleGroup;
  equipment?: Equipment;
  keyword?: string;
}

export interface FilterItem {
  filter: ExerciseFilter;
  name: string;
  imgUrl?: string;
  imgURL?: string;
}

export interface FiltersResponse {
  page: number;
  perPage: number;
  totalPages: number;
  results: FilterItem[];
}

export interface ExerciseResponse {
  _id: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  name: string;
  target: string;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
}

export interface ExercisesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  results: ExerciseResponse[];
}

export type ExerciseDetails = ExerciseResponse;

export interface RatingRequest {
  rate: number;
  email: string;
  review?: string;
}

export type ExerciseRatingPayload = RatingRequest;

export type ExerciseRatingResponse = ExerciseResponse;

export interface QuoteResponse {
  author: string;
  quote: string;
}

export type QuoteOfTheDay = QuoteResponse;

export interface SubscriptionRequest {
  email: string;
}

export type SubscriptionPayload = SubscriptionRequest;

export interface SubscriptionResponse {
  message: string;
}
