import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class MenuAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.MENU;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      this.templateService.apply('en', 'base', {
        quotes: this.util.chunk(this.exchangeService.getQuote('BTC')),
        chose: 'BTC',
      });
      // return msg;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
