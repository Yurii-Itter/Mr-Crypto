import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.CRYPTOCURRENCIES;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // const { location } = msg;
      // const { timeZone, lang } = chat;
      // if (location && !timeZone) {
      //   chat.timeZone = await this.timeZoneService.getTimezone(location, lang);
      //   chat.location = location;
      //   await chat.save();
      //   msg.withData({ timezone: true });
      // }
      // return msg.withData({
      //   cryptocurrencies: this.util.chunk(
      //     this.cryptocurrenciesService.getBase(),
      //   ),
      // });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
