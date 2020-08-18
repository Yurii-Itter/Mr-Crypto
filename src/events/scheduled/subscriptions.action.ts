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
      subscriptions.forEach(subscription => {
        const { id, language_code, symbol } = subscription;
        const { text, extra } = this.templateService.apply(
          language_code,
          this.eventService.QUOTE,
          {
            list: this.exchangeService.getList(symbol),
            subscribed: true,
            formated: this.exchangeService.getFormated(symbol),
            symbol,
          },
        );

        this.telegramService.telegram.sendMessage(id, text, extra);
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
