import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.CRYPTOCURRENCIES;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    try {
      const { location } = msg;

      if (location) {
        chat.timeZone = await this.timeZoneService.getTimezone(location);
        chat.location = location;
        await chat.save();
        return msg;
      }

      return msg.withData({
        cryptocurrencies: this.cryptocurrenciesService.getBaseKeyboard(),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
