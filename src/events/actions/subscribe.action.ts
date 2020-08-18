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

      const raw = data.split('-');
      const [, symbol, mon, tue, wed, thu, fri, sat, sun, h, hh, m, mm] = raw;
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

      chat.subscriptions.push({ symbol, period: { days, hour, minute } });
      await chat.save();

      this.edit = true;
      this.values = { formated };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
