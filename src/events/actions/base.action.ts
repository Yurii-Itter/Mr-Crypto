import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class BaseAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.BASE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const { language_code } = chat;
      const action = this.eventService.BASE;

      const rawBases = this.exchangeService.getBase();
      const bases = this.util.chunk(rawBases, 3);

      const template = this.templateService.apply(language_code, action, {
        bases,
      });
      const { text, extra } = template;

      await ctx.reply(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
