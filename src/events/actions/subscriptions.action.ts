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
      const { language_code } = chat;
      const action = this.eventService.SUBSCRIPTIONS;

      const rawSubscriptions = chat.subscriptions
        .map(subscription =>
          this.exchangeService.getFormated(subscription.symbol),
        )
        .reverse();
      const subscriptions = this.util.chunk(rawSubscriptions, 2);
      const zero = subscriptions.length === 0 ? true : false;

      const template = this.templateService.apply(language_code, action, {
        subscriptions,
        zero,
      });
      const { text, extra } = template;

      await ctx.reply(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
