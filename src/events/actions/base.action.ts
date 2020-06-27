import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class BaseAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.BASE;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      if (msg.data) {
        const [base] = msg.data.split('_');

        return msg
          .setStatus(statuses.BASIC)
          .withData({
            quotes: this.cryptocurrenciesService.getQuote(base, true),
            chose: base,
          })
          .withEdit();
      } else {
        return msg.setStatus(statuses.BASIC).withData({
          quotes: this.cryptocurrenciesService.getQuote(msg.text, true),
          chose: msg.text,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
