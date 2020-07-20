import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class SubscriptionsAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.SUBSCRIPTIONS;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      const { sub } = chat;

      return msg.withData({
        sub: this.util.chunk(
          sub.map(({ symbol }) =>
            this.cryptocurrenciesService.getFormated(symbol),
          ),
        ),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
