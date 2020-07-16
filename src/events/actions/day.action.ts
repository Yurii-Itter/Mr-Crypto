import { Injectable } from '@nestjs/common';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { Action } from '../action';

@Injectable()
export class DayAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.DAY;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      if (!chat.timeZone) {
        return msg.withAction(this.appEmitter.TIMEZONE).withoutEdit();
      }

      const [data] = msg.data.split('_');
      const [
        symbol,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ] = data.split('-');

      return msg.withData({
        symbol,
        monday: monday ? monday == 'true' : true,
        tuesday: tuesday ? tuesday == 'true' : true,
        wednesday: wednesday ? wednesday == 'true' : true,
        thursday: thursday ? thursday == 'true' : true,
        friday: friday ? friday == 'true' : true,
        saturday: saturday ? saturday == 'true' : true,
        sunday: sunday ? sunday == 'true' : true,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
