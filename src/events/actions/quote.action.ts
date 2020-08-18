import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class QuoteAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.QUOTE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);
      const [base, symbol] = data.split('-');

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          list: this.exchangeService.getList(symbol),
          subscribed: chat.subscriptions.map(s => s.symbol).includes(symbol),
          formated: this.exchangeService.getFormated(symbol),
          symbol,
          base,
        }
      );

      await ctx.editMessageText(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
