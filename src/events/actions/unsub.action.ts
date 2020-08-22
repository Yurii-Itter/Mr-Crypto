import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class UnsubAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.UNSUB;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const { language_code } = chat;
      const action = this.eventService.UNSUB;
      const sAction = this.eventService.SUBSCRIPTIONS;

      const symbol = data;
      const formated = this.exchangeService.getFormated(symbol);

      chat.subscriptions = chat.subscriptions.filter(
        subscription => subscription.symbol !== symbol,
      );
      await chat.save();

      const unchunked = chat.subscriptions.map(subscription =>
        this.exchangeService.getFormated(subscription.symbol),
      );
      const subscriptions = this.util.chunk(unchunked, 2);

      const template = this.templateService.apply(language_code, action, {
        formated,
      });
      const { text, extra } = template;

      const sTemplate = this.templateService.apply(language_code, sAction, {
        subscriptions
      });
      const { text: sText, extra: sExtra } = sTemplate;

      await ctx.editMessageText(text, extra);
      await ctx.reply(sText, sExtra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
