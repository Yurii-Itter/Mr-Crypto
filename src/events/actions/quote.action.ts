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
      const isCallback = this.util.isCallback(ctx);

      const { language_code } = chat;
      const action = this.eventService.QUOTE;

      const base = data;
      const rawQuotes = this.exchangeService.getQuote(data);
      const quotes = this.util.chunk(rawQuotes, 3);

      const template = this.templateService.apply(language_code, action, {
        base,
        quotes,
      });
      const { text, extra } = template;

      if (isCallback) {
        await ctx.editMessageText(text, extra);
      } else {
        await ctx.reply(text, extra);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
