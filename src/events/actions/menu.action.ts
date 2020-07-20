import { Injectable } from '@nestjs/common';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class MenuAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.MENU;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      return msg;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
