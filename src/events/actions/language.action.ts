import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class LanguageAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.LANGUAGE;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);
      const isCallback = this.util.isCallback(ctx);

      const action = this.eventService.LANGUAGE;

      if (isCallback) {
        const [language_code] = data.split('_');
        const sAction = this.eventService.SETTINGS;

        chat.language_code = language_code;
        await chat.save();

        const template = this.templateService.apply(language_code, action, {
          updated: true
        });
        const { text, extra } = template;

        const sTemplate = this.templateService.apply(language_code, sAction, {});
        const { text: sText, extra: sExtra } = sTemplate;

        await ctx.editMessageText(text, extra);
        await ctx.reply(sText, sExtra);
      } else {
        const { language_code } = chat;

        const template = this.templateService.apply(language_code, action, {
          updated: false
        });
        const { text, extra } = template;

        await ctx.reply(text, extra);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
