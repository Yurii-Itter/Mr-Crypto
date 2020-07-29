import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AppEmitter } from './event.service';
import { DatabaseService } from '../database/database.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class SchedulerService {
  private appEmitter: AppEmitter;
  private databaseService: DatabaseService;
  private telegramService: TelegramService;

  constructor(
    appEmitter: AppEmitter,
    databaseService: DatabaseService,
    telegramService: TelegramService,
  ) {
    this.appEmitter = appEmitter;
    this.databaseService = databaseService;
    this.telegramService = telegramService;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  private async triggerSubscriptions(): Promise<void> {
    const subscriptions = await this.databaseService.subscriptions();
    subscriptions.forEach(({ chatId, symbol, lang, firstName, lastName }) => {
      this.telegramService.emit(
        this.appEmitter.QUOTE,
        {
          update: {
            message: {
              location: undefined,
              subscription: true,
              message_id: undefined,
              text: symbol,
              from: {
                language_code: lang,
                first_name: firstName,
                last_name: lastName,
              },
              chat: {
                id: chatId,
              },
            },
          },
          updateType: 'subscription',
        },
        false,
      );
    });
  }
}
