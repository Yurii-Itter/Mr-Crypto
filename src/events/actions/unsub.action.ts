import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class UnsubAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.UNSUB;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      const { id } = this.util.getMessage(ctx).from;
      const chat = await this.databaseService.findChat(id);

      const data = this.util.getData(ctx);
      const [symbol] = data.split('_');

      chat.subscriptions.filter(subscription => {
        subscription.symbol !== symbol;
      });

      await chat.save();

      // const { message_id } = this.util.getMessage(ctx);
      // const data = this.util.getData(ctx);
      // const [symbol] = data.split('_');
      // const { id, language_code } = chat;
      // const { content } = this.templateService.apply(
      //   { action: this.action, lang },
      //   { formated: this.exchangeService.getFormated(symbol) },
      // );
      // ctx.
    } catch (error) {
      this.logger.error(error);
    }
  }
}
