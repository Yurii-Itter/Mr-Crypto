import { Injectable } from '@nestjs/common';

import { TelegramMessageInterface } from '../../telegram/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class MenuAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.MENU;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: TelegramMessageInterface,
  ): Promise<TelegramMessageInterface> {
    try {
      return msg;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
