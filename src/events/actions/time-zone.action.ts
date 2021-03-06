import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class TimeZoneAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.TIMEZONE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    const { language_code, timeZoneId } = chat;
    const action = this.eventService.TIMEZONE;

    const update = timeZoneId ? true : false;

    const template = this.templateService.apply(language_code, action, {
      update,
    });
    const { text, extra } = template;

    await ctx.reply(text, extra);
  }
}
