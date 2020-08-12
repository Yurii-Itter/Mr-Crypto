import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class QuoteAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.QUOTE;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // if (msg.queryData) {
      //   const [data] = msg.queryData.split('_');
      //   const [base, symbol] = data.split('-');
      //   return msg.withData({
      //     list: this.cryptocurrenciesService.getList(symbol),
      //     subscribed: chat.sub.map(s => s.symbol).includes(symbol),
      //     formated: this.cryptocurrenciesService.getFormated(symbol),
      //     symbol,
      //     base,
      //   });
      // } else {
      //   const symbol = msg.text.replace('-', '');
      //   return msg.withData({
      //     list: this.cryptocurrenciesService.getList(symbol),
      //     subscribed: chat.sub.map(s => s.symbol).includes(symbol),
      //     formated: this.cryptocurrenciesService.getFormated(symbol),
      //     symbol,
      //   });
      // }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
