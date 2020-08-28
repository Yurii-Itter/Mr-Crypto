import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class LocationAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.LOCATION;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const message = this.util.getMessage(ctx);

      const { language_code } = chat;
      const action = this.eventService.LOCATION;
      const sAction = this.eventService.BASE;

      const { location } = message;
      const rawBases = this.exchangeService.getBase();
      const bases = this.util.chunk(rawBases, 3);
      const updated = chat.timeZoneId ? true : false;
      const { timeZoneId } = await this.timeZoneService.getTimezoe(location);

      chat.timeZoneId = timeZoneId;
      await chat.save();

      const template = this.templateService.apply(language_code, action, {
        updated,
        timeZoneId,
      });
      const { text, extra } = template;

      const sTemplate = this.templateService.apply(language_code, sAction, {
        bases,
      });
      const { text: sText, extra: sExtra } = sTemplate;

      await ctx.reply(text, extra);
      await ctx.reply(sText, sExtra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
