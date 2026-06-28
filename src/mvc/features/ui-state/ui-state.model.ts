export type UiStatusVariant = 'idle' | 'loading' | 'success' | 'error';

export interface UiState {
  isLoading: boolean;
  error: string | null;
  statusMessage: string;
  statusVariant: UiStatusVariant;
}

export class UiStateModel {
  private state: UiState = {
    isLoading: false,
    error: null,
    statusMessage: 'Ready',
    statusVariant: 'idle',
  };

  getState(): UiState {
    return this.state;
  }

  startLoading(message: string): UiState {
    this.state = {
      isLoading: true,
      error: null,
      statusMessage: message,
      statusVariant: 'loading',
    };

    return this.state;
  }

  finishLoading(message: string): UiState {
    this.state = {
      ...this.state,
      isLoading: false,
      statusMessage: message,
      statusVariant: 'success',
    };

    return this.state;
  }

  setError(message: string): UiState {
    this.state = {
      ...this.state,
      isLoading: false,
      error: message,
      statusMessage: message,
      statusVariant: 'error',
    };

    return this.state;
  }
}
