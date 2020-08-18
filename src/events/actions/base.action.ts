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
      const data = this.util.getData(ctx);

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          quotes: this.util.chunk(this.exchangeService.getQuote(data)),
          chose: data,
        },
      );

      await ctx.replyWithHTML(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
