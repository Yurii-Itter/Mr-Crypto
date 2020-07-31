import { Injectable } from '@nestjs/common';

import { TelegramMessageInterface } from '../../telegram/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class QuoteAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.QUOTE;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: TelegramMessageInterface,
  ): Promise<TelegramMessageInterface> {
    try {
      if (msg.data) {
        const [data] = msg.data.split('_');
        const [base, symbol] = data.split('-');

        return msg
          .withData({
            list: this.cryptocurrenciesService.getList(symbol),
            subscribed: chat.sub.map(s => s.symbol).includes(symbol),
            formated: this.cryptocurrenciesService.getFormated(symbol),
            symbol,
            base,
          })
          .withEdit();
      } else {
        if (msg.subscription) {
          const symbol = msg.text;

          return msg.withData({
            list: this.cryptocurrenciesService.getList(symbol),
            subscribed: chat.sub.map(s => s.symbol).includes(symbol),
            formated: this.cryptocurrenciesService.getFormated(symbol),
            symbol,
          });
        } else {
          const symbol = msg.text.replace('-', '');

          return msg.withData({
            list: this.cryptocurrenciesService.getList(symbol),
            subscribed: chat.sub.map(s => s.symbol).includes(symbol),
            formated: this.cryptocurrenciesService.getFormated(symbol),
            symbol,
          });
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
