import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { Action } from '../action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.CRYPTOCURRENCIES;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      return msg.setStatus(statuses.BASIC).withData({
        cryptocurrencies: this.cryptocurrenciesService.getBase(true),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
