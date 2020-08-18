import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class QuoteAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.QUOTE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const [base, symbol] = data.split('-');
      const list = this.exchangeService.getList(symbol);
      const formated = this.exchangeService.getFormated(symbol);
      const subscribed = chat.subscriptions.map(s => s.symbol).includes(symbol);

      this.edit = true;
      this.values = { list, subscribed, formated, symbol, base };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
