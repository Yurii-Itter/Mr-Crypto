import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { TelegramMessageInterface } from '../../telegram/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class TimeZoneAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.TIMEZONE;
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
