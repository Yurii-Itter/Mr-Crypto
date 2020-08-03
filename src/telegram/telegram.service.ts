import { Telegraf, Telegram } from 'telegraf';

import { Injectable, Inject } from '@nestjs/common';

import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { CryptocurrenciesService } from '../cryptocurrencies/cryptocurrencies.service';

import { TelegramMessage } from './telegram.message';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;
  private telegram: Telegram;
  private appEmitter: AppEmitter;
  private cryptocurrenciesService: CryptocurrenciesService;

  constructor(
    @Inject('CryptocurrenciesServiceInstance')
    cryptocurrenciesService: CryptocurrenciesService,
    configService: ConfigService,
    appEmitter: AppEmitter,
  ) {
    const token = configService.get('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);
    this.telegram = this.bot.telegram;

    this.appEmitter = appEmitter;
    this.cryptocurrenciesService = cryptocurrenciesService;

    this.bot.start(async ctx => this.emit(appEmitter.START, ctx, false));

    this.bot.on('location', async ctx =>
      this.emit(appEmitter.CRYPTOCURRENCIES, ctx, false),
    );

    this.bot
      .hears(
        (base: string) => {
          return cryptocurrenciesService.getBase().includes(base)
            ? /true/.exec('true')
            : /true/.exec('false');
        },
        async ctx => this.emit(appEmitter.BASE, ctx, false),
      )
      .hears(
        (symbol: string) => {
          return cryptocurrenciesService
            .getSymbols()
            .includes(symbol.replace('-', ''))
            ? /true/.exec('true')
            : /true/.exec('false');
        },
        async ctx => this.emit(appEmitter.QUOTE, ctx, false),
      )
      .hears(['Cryptocurrencies 💰', 'Криптовалюты 💰'], async ctx =>
        this.emit(appEmitter.CRYPTOCURRENCIES, ctx, false),
      )
      .hears(['My Subscriptions ⭐️', 'Мои Подписки ⭐️'], async ctx =>
        this.emit(appEmitter.SUBSCRIPTIONS, ctx, false),
      )
      .hears(['About Service 🚀', 'О Сервисе 🚀'], async ctx =>
        this.emit(appEmitter.ABOUT, ctx, false),
      )
      .hears(['Settings ⚙️', 'Настройки ⚙️'], async ctx =>
        this.emit(appEmitter.SETTINGS, ctx, false),
      )
      .hears(['◀️ Back', '◀️ Назад'], async ctx =>
        this.emit(appEmitter.MENU, ctx, false),
      );

    this.bot
      .action(/.+_base/, async ctx => this.emit(appEmitter.BASE, ctx, true))
      .action(/.+_day/, async ctx => this.emit(appEmitter.DAY, ctx, true))
      .action(/.+_time/, async ctx => this.emit(appEmitter.TIME, ctx, true))
      .action(/.+_sub/, async ctx => this.emit(appEmitter.SUB, ctx, true))
      .action(/.+_unsub/, async ctx => this.emit(appEmitter.UNSUB, ctx, true))
      .action(/.+_quote/, async ctx => this.emit(appEmitter.QUOTE, ctx, true));
  }

  public async emit(action: string, ctx: any, edit: boolean): Promise<void> {
    this.appEmitter.emit(
      action,
      edit
        ? new TelegramMessage(ctx, this.telegram).withEdit()
        : new TelegramMessage(ctx, this.telegram),
    );
  }

  public async launch(): Promise<void> {
    await this.cryptocurrenciesService.launch();
    await this.bot.launch();
  }
}
