import {
  SubscriptionPayload,
  SubscriptionResponse,
  subscribeToNewsletter,
} from '../../api';

export class SubscriptionModel {
  async subscribe(payload: SubscriptionPayload): Promise<SubscriptionResponse> {
    return subscribeToNewsletter(payload);
  }
}
