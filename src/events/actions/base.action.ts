import { Injectable } from '@nestjs/common';

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
      const res = msg.data ? msg.data.split('_')[0] : msg.text;

      return msg
        .withData({
          quotes: this.cryptocurrenciesService.getQuoteKeyboard(res),
          chose: res,
        })
        .withAction(this.appEmitter.BASE);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
