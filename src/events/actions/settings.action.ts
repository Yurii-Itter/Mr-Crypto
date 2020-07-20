import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class SettingsAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.SETTINGS;
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
