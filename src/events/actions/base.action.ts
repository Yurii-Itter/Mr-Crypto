import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class BaseAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.BASE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);
      const isCallback = this.util.isCallback(ctx);

      const chose = data;
      const quotes = this.util.chunk(this.exchangeService.getQuote(data), 3);

      this.edit = isCallback;
      this.values = { quotes, chose };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
