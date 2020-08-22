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

      const { location } = message;
      const updated = chat.timeZoneId ? true : false;
      const { timeZoneId } = await this.timeZoneService.getTimezoe(location);

      chat.timeZoneId = timeZoneId;
      await chat.save();

      const template = this.templateService.apply(language_code, action, {
        updated,
      });
      const { text, extra } = template;

      await ctx.reply(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
