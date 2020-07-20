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
      const { timeZone } = chat;

      if (location && !timeZone) {
        chat.timeZone = await this.timeZoneService.getTimezone(location);
        chat.location = location;
        await chat.save();
        msg.withData({ timezone: true });
      }

      return msg.withData({
        cryptocurrencies: this.util.chunk(
          this.cryptocurrenciesService.getBase(),
        ),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
