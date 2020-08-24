import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';

import { ScheduledAction } from '../scheduled.action';

@Injectable()
export class SubscriptionsScheduledAction extends ScheduledAction {
  protected setJobName(): void {
    this.jobName = this.nameService.SUBSCRIPTIONS;
  }

  protected setJobInterval(): void {
    this.jobInterval = CronExpression.EVERY_MINUTE;
  }

  protected async doAction(): Promise<void> {
    try {
      const subscriptions = await this.databaseService.findSubscriptions();
      subscriptions.forEach(async subscription => {
        const { id, language_code, symbol } = subscription;

        const action = this.eventService.SYMBOL;

        const list = this.exchangeService.getList(symbol);
        const formated = this.exchangeService.getFormated(symbol);
        const [, quote] = formated.split('-');
        const sign = this.util.fiat(quote);
        const hide = true;

        const template = this.templateService.apply(language_code, action, {
          hide,
          sign,
          list,
          symbol,
          formated,
          subscribed: true,
        });
        const { text, extra } = template;

        await this.telegram.sendMessage(id, text, extra);
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
