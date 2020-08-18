import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class CryptocurrenciesAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.CRYPTOCURRENCIES;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      let timeZone = false;

      const { timeZoneId, language_code } = chat;
      const { location } = this.util.getMessage(ctx);

      if (location && !timeZoneId) {
        const { timeZoneId } = await this.timeZoneService.getTimezoe(
          location,
          language_code,
        );
        chat.timeZoneId = timeZoneId;
        await chat.save();
        timeZone = true;
      }

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          cryptocurrencies: this.util.chunk(this.exchangeService.getBase()),
          timeZone,
        },
      );

      await ctx.replyWithHTML(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
