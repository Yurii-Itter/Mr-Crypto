import { Extra, Markup } from 'telegraf';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class UnsubAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.UNSUB;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const symbol = this.util.getData(ctx);

      const { text } = this.templateService.apply(
        chat.language_code,
        this.event,
        { formated: this.exchangeService.getFormated(symbol) }
      );

      chat.subscriptions.filter(subscription => {
        subscription.symbol !== symbol;
      });

      await chat.save();

      await ctx.editMessageText(text, Extra.markup(Markup.formatHTML));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
