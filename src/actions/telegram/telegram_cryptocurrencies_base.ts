import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { BaseAction } from '../base.action';

@Injectable()
export class CryptocurrenciesBaseAction extends BaseAction {
  protected setEvent(): void {
    this.event = this.appEmitter.TELEGRAM_CRYPTOCURRENCIES_BASE;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      return msg.setStatus(statuses.STATUS_SUCCESS).withData({
        quotes: this.cryptocurrenciesService.getQuote(msg.text, true),
        chose: msg.text,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
