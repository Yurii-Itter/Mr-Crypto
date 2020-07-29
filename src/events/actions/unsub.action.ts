import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { TelegramMessageInterface } from '../../telegram/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class UnsubAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.UNSUB;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: TelegramMessageInterface,
  ): Promise<TelegramMessageInterface> {
    try {
      const { chatId } = chat;

      const [data] = msg.data.split('_');
      const symbol = data;

      await this.databaseService.unsub({
        chatId,
        symbol,
      });

      return msg.withData({
        formated: this.cryptocurrenciesService.getFormated(symbol),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
