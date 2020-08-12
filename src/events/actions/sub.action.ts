import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class SubAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SUBSCRIBE;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // const { chatId } = chat;
      // const [data] = msg.queryData.split('_');
      // const [
      //   ,
      //   symbol,
      //   monday,
      //   tuesday,
      //   wednesday,
      //   thursday,
      //   friday,
      //   saturday,
      //   sunday,
      //   h,
      //   hh,
      //   m,
      //   mm,
      // ] = data.split('-');
      // const hour = +(h + hh);
      // const minute = +(m + mm);
      // const days = [
      //   monday,
      //   tuesday,
      //   wednesday,
      //   thursday,
      //   friday,
      //   saturday,
      //   sunday,
      // ].reduce((accum: number[], day: string, index: number) => {
      //   if (day === 'on' || day === 'son') {
      //     accum.push(index + 1);
      //   }
      //   return accum;
      // }, []);
      // await this.databaseService.sub({
      //   chatId,
      //   sub: { symbol, period: { days, hour, minute } },
      // });
      // return msg.withData({
      //   formated: this.cryptocurrenciesService.getFormated(symbol),
      // });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
