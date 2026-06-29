import { ExampleModel } from './example.model';
import { ExampleView } from './example.view';

export class ExampleController {
  constructor(
    private readonly model: ExampleModel,
    private readonly view: ExampleView
  ) {}

  init(): void {
    this.view.render(this.model.getState());
    this.bindEvents();
    void this.loadApiData();
  }

  private bindEvents(): void {
    this.view.onLoad(() => {
      void this.loadApiData();
    });

    this.view.onRate(() => {
      void this.runRequest(() => this.model.rateSelectedExercise());
    });

    this.view.onSubscribe(() => {
      void this.runRequest(() => this.model.subscribe());
    });
  }

  private async loadApiData(): Promise<void> {
    await this.runRequest(() => this.model.loadReadExamples());
  }

  private async runRequest(request: () => Promise<unknown>): Promise<void> {
    this.view.setLoading(true);

    try {
      await request();
      this.view.render(this.model.getState());
    } catch (error) {
      this.view.renderError(error);
    } finally {
      this.view.setLoading(false);
    }
  }
}
