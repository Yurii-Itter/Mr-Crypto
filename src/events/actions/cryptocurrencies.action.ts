import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.CRYPTOCURRENCIES;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const cryptocurrencies = this.util.chunk(
        this.exchangeService.getBase(),
        3,
      );

      this.edit = false;
      this.values = { cryptocurrencies };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
