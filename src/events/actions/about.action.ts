import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class AboutAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.ABOUT;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    const { language_code } = chat;
    const action = this.eventService.ABOUT;

    const template = this.templateService.apply(language_code, action, {});
    const { text, extra } = template;

    await ctx.reply(text, extra);
  }
}
