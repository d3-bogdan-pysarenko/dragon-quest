import { SubscriptionModel, SubscriptionView } from './';
import { showToast, ToastType } from '../../components/toast';
import { validateEmail, getErrorMessage } from '../../utils';
import type { SubscriptionRequest, SubscriptionResponse } from '../../api';

export class SubscriptionController {
  constructor(
    private model: SubscriptionModel,
    private view: SubscriptionView
  ) {}

  init(): void {
    this.bindEvents();
    this.view.enableSubmit();
  }

  private bindEvents(): void {
    this.view.onSubscribe(email => {
      this.handleSubscription(email);
    });
  }

  private async handleSubscription(email: string): Promise<void> {
    if (!email) {
      showToast('Email is required', ToastType.Error);
      return;
    }

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      showToast('Please enter a valid email address.', ToastType.Error);
      return;
    }

    const payload: SubscriptionRequest = { email };
    await this.runRequest(() => this.model.subscribe(payload));
  }

  private async runRequest(
    request: () => Promise<SubscriptionResponse>
  ): Promise<void> {
    this.view.setLoading(true);

    try {
      const result = await request();
      showToast(result.message, ToastType.Success);
      this.view.resetForm();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, ToastType.Error);
    } finally {
      this.view.setLoading(false);
    }
  }
}
