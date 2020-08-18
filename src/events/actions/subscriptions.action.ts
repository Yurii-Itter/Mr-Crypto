import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class SubscriptionsAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SUBSCRIPTIONS;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const unchunked = chat.subscriptions.map(subscription => {
        const { symbol } = subscription;
        return this.exchangeService.getFormated(symbol);
      });
      const subscriptions = this.util.chunk(unchunked, 2);

      this.edit = false;
      this.values = { subscriptions };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
