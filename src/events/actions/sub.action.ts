import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { Action } from '../action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class SubAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.SUB;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {

      const { location } = msg;
      const { timeZone } = chat;

      if (timeZone) {
        return msg.setStatus(statuses.SUB_TIME);
      } else {

        if (location) {
          chat.timeZone = await this.timeZoneService.getTimezone(location);
          chat.location = location;
          await chat.save();
          return msg.setStatus(statuses.SUB_TIME);
        }

        return msg.setStatus(statuses.SUB_TIME_ZONE);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
