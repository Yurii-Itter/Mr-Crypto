import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class BaseAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.BASE;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // const base = msg.queryData ? msg.queryData.split('_')[0] : msg.text;
      // return msg
      //   .withData({
      //     quotes: this.util.chunk(this.cryptocurrenciesService.getQuote(base)),
      //     chose: base,
      //   })
      //   .withAction(this.eventService.BASE);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
