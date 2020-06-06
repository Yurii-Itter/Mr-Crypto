import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { BaseAction } from '../base.action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class StartAction extends BaseAction {
  protected setEvent(): void {
    this.event = this.appEmitter.TELEGRAM_START;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      return msg.setStatus(statuses.STATUS_SUCCESS);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
