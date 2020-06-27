import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class QuoteAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.QUOTE;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      const [data] = msg.data.split('_');
      const [base, symbol] = data.split('-');

      return msg
        .setStatus(statuses.BASIC)
        .withData({
          list: this.cryptocurrenciesService.getList(symbol),
          base,
        })
        .withEdit();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
