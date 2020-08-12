import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class SubscriptionsAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SUBSCRIPTIONS;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // const { sub } = chat;
      // return msg.withData({
      //   sub: this.util.chunk(
      //     sub.map(({ symbol }) =>
      //       this.cryptocurrenciesService.getFormated(symbol),
      //     ),
      //   ),
      // });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
