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

    this.botService.start(async ctx =>
      appEmitter.emit(appEmitter.START, new TelegramMessage(ctx)),
    );

    this.botService.on('location', async ctx =>
      appEmitter.emit(appEmitter.CRYPTOCURRENCIES, new TelegramMessage(ctx)),
    );

    this.botService
      .hears(
        (base: string) => {
          return cryptocurrenciesService.getBase().includes(base)
            ? /true/.exec('true')
            : /true/.exec('false');
        },
        async ctx => appEmitter.emit(appEmitter.BASE, new TelegramMessage(ctx)),
      )
      .hears(
        (symbol: string) => {
          return cryptocurrenciesService
            .getSymbols()
            .includes(symbol.replace('-', ''))
            ? /true/.exec('true')
            : /true/.exec('false');
        },
        async ctx =>
          appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx)),
      )
      .hears(['Cryptocurrencies 💰', 'Криптовалюты 💰'], async ctx =>
        appEmitter.emit(appEmitter.CRYPTOCURRENCIES, new TelegramMessage(ctx)),
      )
      .hears(['My Subscriptions ⭐️', 'Мои Подписки ⭐️'], async ctx =>
        appEmitter.emit(appEmitter.SUBSCRIPTIONS, new TelegramMessage(ctx)),
      )
      .hears(['About Service 🚀', 'О Сервисе 🚀'], async ctx =>
        appEmitter.emit(appEmitter.ABOUT, new TelegramMessage(ctx)),
      )
      .hears(['Settings ⚙️', 'Настройки ⚙️'], async ctx =>
        appEmitter.emit(appEmitter.SETTINGS, new TelegramMessage(ctx)),
      )
      .hears(['◀️ Back', '◀️ Назад'], async ctx =>
        appEmitter.emit(appEmitter.MENU, new TelegramMessage(ctx)),
      );

    this.botService
      .action(/.+_baseback/, async ctx =>
        appEmitter.emit(appEmitter.BASE, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_quoteback/, async ctx =>
        appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_dayback/, async ctx =>
        appEmitter.emit(appEmitter.DAY, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_day/, async ctx =>
        appEmitter.emit(appEmitter.DAY, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_time/, async ctx =>
        appEmitter.emit(appEmitter.TIME, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_sub/, async ctx =>
        appEmitter.emit(appEmitter.SUB, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_unsub/, async ctx =>
        appEmitter.emit(appEmitter.UNSUB, new TelegramMessage(ctx).withEdit()),
      )
      .action(/.+_quote/, async ctx =>
        appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx).withEdit()),
      );
  }

  public async launch(): Promise<void> {
    await this.botService.launch();
  }
}
