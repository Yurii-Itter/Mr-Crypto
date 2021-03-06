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
      const data = this.util.getData(ctx);
      const isCallback = this.util.isCallback(ctx);

      const { language_code, subscriptions } = chat;
      const action = this.eventService.SYMBOL;

      const hide = false;

      if (isCallback) {
        const [rawBase, symbol] = data.split('-');
        const base = rawBase === 'false' ? false : rawBase;
        const list = this.exchangeService.getList(symbol);
        const formated = this.exchangeService.getFormated(symbol);
        const [, quote] = formated.split('-');
        const sign = this.util.fiat(quote);
        const subscribed = subscriptions.map(s => s.symbol).includes(symbol);

        const template = this.templateService.apply(language_code, action, {
          hide,
          sign,
          list,
          base,
          symbol,
          formated,
          subscribed,
        });
        const { text, extra } = template;

        await ctx.editMessageText(text, extra);
      } else {
        const formated = data;
        const [, quote] = formated.split('-');
        const sign = this.util.fiat(quote);
        const symbol = data.replace('-', '');
        const list = this.exchangeService.getList(symbol);
        const subscribed = subscriptions.map(s => s.symbol).includes(symbol);

        const template = this.templateService.apply(language_code, action, {
          hide,
          sign,
          list,
          symbol,
          formated,
          subscribed,
        });
        const { text, extra } = template;

        await ctx.reply(text, extra);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
