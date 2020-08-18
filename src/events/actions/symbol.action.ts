import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class SymbolAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SYMBOL;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const symbol = this.util.getData(ctx);

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          list: this.exchangeService.getList(symbol),
          subscribed: chat.subscriptions.map(s => s.symbol).includes(symbol),
          formated: this.exchangeService.getFormated(symbol),
          symbol,
        }
      );

      await ctx.replyWithHTML(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
