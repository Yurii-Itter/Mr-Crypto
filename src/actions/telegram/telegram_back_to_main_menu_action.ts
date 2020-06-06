import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { BaseAction } from '../base.action';

@Injectable()
export class BackToMainMenuAction extends BaseAction {
  protected setEvent(): void {
    this.event = this.appEmitter.TELEGRAM_BACK_TO_MAIN_MENU;
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
