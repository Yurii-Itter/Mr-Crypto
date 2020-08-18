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
      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          subscriptions: this.util.chunk(
            chat.subscriptions.map(({ symbol }) =>
              this.exchangeService.getFormated(symbol),
            ),
          ),
        },
      );

      await ctx.replyWithHTML(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
