import {
  subscribeToNewsletter,
  type SubscriptionPayload,
  type SubscriptionResponse,
} from '../../api';

export class SubscriptionModel {
  async subscribe(payload: SubscriptionPayload): Promise<SubscriptionResponse> {
    return subscribeToNewsletter(payload);
  }
}
