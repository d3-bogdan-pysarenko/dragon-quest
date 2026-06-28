import type { UiStatusVariant } from '../features/ui-state/ui-state.model';

export class StatusView {
  constructor(private readonly root: HTMLElement) {}

  render(message: string, variant: UiStatusVariant): void {
    this.root.dataset.status = variant;
    this.root.innerHTML = `
      <span class="ye-header__status-indicator" aria-hidden="true"></span>
      <span class="ye-header__status-text">${message}</span>
    `;
  }
}
