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
      const [
        ,
        symbol,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
        h,
        hh,
        m,
        mm,
      ] = data.split('-');

      const hour = +(h + hh);
      const minute = +(m + mm);

      const days = [mon, tue, wed, thu, fri, sat, sun].reduce(
        (accum: number[], day: string, index: number) => {
          if (day === 'on' || day === 'son') {
            accum.push(index + 1);
          }
          return accum;
        },
        [],
      );

      chat.subscriptions.push({ symbol, period: { days, hour, minute } });

      await chat.save();

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        { formated: this.exchangeService.getFormated(symbol) }
      );

      await ctx.editMessageText(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
