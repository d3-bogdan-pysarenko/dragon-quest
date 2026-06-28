import { UiStateModel } from './ui-state.model';
import { YourEnergyView } from '../../your-energy.view';

export class UiStateController {
  constructor(
    private readonly model: UiStateModel,
    private readonly view: YourEnergyView
  ) {}

  getState() {
    return this.model.getState();
  }

  startLoading(message: string): void {
    const state = this.model.startLoading(message);
    this.view.setStatus(state.statusMessage, state.statusVariant);
  }

  finishLoading(message: string): void {
    const state = this.model.finishLoading(message);
    this.view.setStatus(state.statusMessage, state.statusVariant);
  }

  setError(message: string): void {
    const state = this.model.setError(message);
    this.view.setStatus(state.statusMessage, state.statusVariant);
  }
}
