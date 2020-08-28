import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class OptionsAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.OPTIONS;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    const data = this.util.getData(ctx);

    const { language_code } = chat;
    const action = this.eventService.OPTIONS;

    const [symbol] = data.split('_');
    const formated = this.exchangeService.getFormated(symbol);
    const subscription = chat.subscriptions.find(
      element => element.symbol === symbol,
    );

    if (!subscription) {
      await ctx.deleteMessage();
      return;
    }

    const { period } = subscription;
    const selTime = `${period.hour === 0 ? '00' : period.hour}:${
      period.minute === 0 ? '00' : period.minute
    }`;
    const selDays = this.util.days(period.days, language_code);
    const parent = `false-${symbol}`;

    const template = this.templateService.apply(language_code, action, {
      parent,
      selDays,
      selTime,
      formated,
      symbol,
    });
    const { text, extra } = template;

    await ctx.editMessageText(text, extra);
  }
}
