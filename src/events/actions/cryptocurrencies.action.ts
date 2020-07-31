import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { TelegramMessageInterface } from '../../telegram/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.action = this.appEmitter.CRYPTOCURRENCIES;
  }

  protected async doAction(
    chat: ChatInterface,
    msg: TelegramMessageInterface,
  ): Promise<TelegramMessageInterface> {
    try {
      const { location } = msg;
      const { timeZone, lang } = chat;

      if (location && !timeZone) {
        chat.timeZone = await this.timeZoneService.getTimezone(location, lang);
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
