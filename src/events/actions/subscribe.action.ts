import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class SubscribeAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SUBSCRIBE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const { language_code } = chat;
      const action = this.eventService.SUBSCRIBE;
      const sAction = this.eventService.SUBSCRIPTIONS;

      const raw = data.split('-');
      const [, symbol, mon, tue, wed, thu, fri, sat, sun, h, hh, m, mm] = raw;

      if (!this.exchangeService.getSymbols().includes(symbol)) {
        await ctx.deleteMessage();
        return;
      }

      const digitized = this.util.num([mon, tue, wed, thu, fri, sat, sun]);
      const selDays = this.util.days(digitized, language_code);
      const selTime = `${h}${hh}:${m}${mm}`;
      const hour = +(h + hh);
      const minute = +(m + mm);
      const formated = this.exchangeService.getFormated(symbol);

      const days = [mon, tue, wed, thu, fri, sat, sun].reduce(
        (accum: number[], day: string, index: number) => {
          if (day === 'on' || day === 'son') {
            accum.push(index + 1);
          }
          return accum;
        },
        [],
      );

      chat.subscriptions = chat.subscriptions.filter(
        subscription => subscription.symbol !== symbol,
      );
      chat.subscriptions.push({ symbol, period: { days, hour, minute } });
      await chat.save();

      const rawSubscriptions = chat.subscriptions
        .map(subscription =>
          this.exchangeService.getFormated(subscription.symbol),
        )
        .reverse();
      const subscriptions = this.util.chunk(rawSubscriptions, 2);

      const template = this.templateService.apply(language_code, action, {
        formated,
        selDays,
        selTime,
      });
      const { text, extra } = template;

      const sTemplate = this.templateService.apply(language_code, sAction, {
        subscriptions,
        zero: false,
      });
      const { text: sText, extra: sExtra } = sTemplate;

      await ctx.editMessageText(text, extra);
      await ctx.reply(sText, sExtra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
