import Telegraf from 'telegraf';

import { Injectable, forwardRef, Inject } from '@nestjs/common';

import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { CryptocurrenciesService } from '../cryptocurrencies/cryptocurrencies.service';

import { TelegramMessage } from './telegram.message';

@Injectable()
export class TelegramService {
  private botService: Telegraf<any>;

  constructor(
    @Inject(forwardRef(() => 'CryptocurrenciesServiceInstance'))
    cryptocurrenciesService: CryptocurrenciesService,
    configService: ConfigService,
    appEmitter: AppEmitter,
  ) {
    const token = configService.get('TELEGRAM_BOT_TOKEN');
    this.botService = new Telegraf(token);

    this.botService.start(ctx =>
      appEmitter.emit(appEmitter.START, new TelegramMessage(ctx)),
    );

    this.botService.on('location', ctx =>
      appEmitter.emit(
        appEmitter.CRYPTOCURRENCIES,
        new TelegramMessage(ctx).withData({ timezone: true }),
      ),
    );

    this.botService
      .hears(
        (base: string) => {
          return cryptocurrenciesService.getBase().includes(base)
            ? true
            : false;
        },
        ctx => appEmitter.emit(appEmitter.BASE, new TelegramMessage(ctx)),
      )
      .hears(['Cryptocurrencies 💰', 'Криптовалюты 💰'], ctx =>
        appEmitter.emit(appEmitter.CRYPTOCURRENCIES, new TelegramMessage(ctx)),
      )
      .hears(['My Subscriptions ⭐️', 'Мои Подписки ⭐️'], ctx =>
        appEmitter.emit(appEmitter.SUBSCRIPTIONS, new TelegramMessage(ctx)),
      )
      .hears(['About Service 🚀', 'О Сервисе 🚀'], ctx =>
        appEmitter.emit(appEmitter.ABOUT, new TelegramMessage(ctx)),
      )
      .hears(['Settings ⚙️', 'Настройки ⚙️'], ctx =>
        appEmitter.emit(appEmitter.SETTINGS, new TelegramMessage(ctx)),
      )
      .hears(['◀️ Back', '◀️ Назад'], ctx =>
        appEmitter.emit(appEmitter.MENU, new TelegramMessage(ctx)),
      );

    this.botService
      .action(/.+_baseback/, ctx =>
        appEmitter.emit(appEmitter.BASE, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_quoteback/, ctx =>
        appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_day/, ctx =>
        appEmitter.emit(appEmitter.DAY, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_exchange/, ctx =>
        appEmitter.emit(
          appEmitter.EXCHANGE,
          new TelegramMessage(ctx).withEdit(),
        ),
      )
      .action(/.+_sub/, ctx =>
        appEmitter.emit(appEmitter.SUB, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_unsub/, ctx =>
        appEmitter.emit(appEmitter.UNSUB, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_quote/, ctx =>
        appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx).withEdit()),
      );
  }

  public async launch(): Promise<void> {
    await this.botService.launch();
  }
}
