import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class UnsubAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.UNSUB;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const symbol = data;
      const formated = this.exchangeService.getFormated(symbol);

      chat.subscriptions = chat.subscriptions.filter(
        subscription => subscription.symbol !== symbol,
      );
      await chat.save();

      this.edit = true;
      this.values = { formated };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
