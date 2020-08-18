import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class SymbolAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SYMBOL;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const formated = data;
      const subscribed = true;
      const symbol = data.replace('-', '');
      const list = this.exchangeService.getList(symbol);

      this.edit = false;
      this.values = { list, subscribed, formated, symbol };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
