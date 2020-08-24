import { Telegraf, Telegram } from 'telegraf';

import { Injectable, Inject } from '@nestjs/common';

import { EventService } from '../common/event.service';
import { ConfigService } from '../common/config.service';
import { ExchangeService } from '../exchanges/exchange.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;
  private eventService: EventService;
  private exchangeService: ExchangeService;

  public telegram: Telegram;

  constructor(
    @Inject('ExchangeServiceInstance')
    exchangeService: ExchangeService,
    configService: ConfigService,
    eventService: EventService,
  ) {
    const token = configService.get('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);

    this.eventService = eventService;
    this.telegram = this.bot.telegram;
    this.exchangeService = exchangeService;

    this.bot.start(async ctx =>
      this.eventService.emit(this.eventService.START, ctx),
    );

    this.bot.on('location', async ctx =>
      this.eventService.emit(this.eventService.LOCATION, ctx),
    );

    this.bot
      .hears(
        base => {
          return exchangeService.getBase().includes(base)
            ? ((true as unknown) as RegExpExecArray)
            : ((false as unknown) as RegExpExecArray);
        },
        async ctx => this.eventService.emit(eventService.QUOTE, ctx),
      )
      .hears(
        symbol => {
          return exchangeService.getSymbols().includes(symbol.replace('-', ''))
            ? ((true as unknown) as RegExpExecArray)
            : ((false as unknown) as RegExpExecArray);
        },
        async ctx => this.eventService.emit(eventService.SYMBOL, ctx),
      )
      .hears(['◀️ Back', '◀️ Назад'], async ctx =>
        this.eventService.emit(this.eventService.MENU, ctx),
      )
      .hears(['Time zone 🕙', 'Часовой пояс 🕙'], async ctx =>
        this.eventService.emit(this.eventService.TIMEZONE, ctx),
      )
      .hears(['Language 🌍', 'Язык 🌍'], async ctx =>
        this.eventService.emit(this.eventService.LANGUAGE, ctx),
      )
      .hears(['Settings ⚙️', 'Настройки ⚙️'], async ctx =>
        this.eventService.emit(this.eventService.SETTINGS, ctx),
      )
      .hears(['About Service 🚀', 'О Сервисе 🚀'], async ctx =>
        this.eventService.emit(this.eventService.ABOUT, ctx),
      )
      .hears(['Subscriptions ⭐️', 'Подписки ⭐️'], async ctx =>
        this.eventService.emit(eventService.SUBSCRIPTIONS, ctx),
      )
      .hears(['Cryptocurrencies 💰', 'Криптовалюты 💰'], async ctx =>
        this.eventService.emit(this.eventService.BASE, ctx),
      );

    this.bot
      .action(/^.+_days$/, async ctx =>
        this.eventService.emit(this.eventService.DAYS, ctx),
      )
      .action(/^.+_time$/, async ctx =>
        this.eventService.emit(this.eventService.TIME, ctx),
      )
      .action(/^.+_quote$/, async ctx =>
        this.eventService.emit(this.eventService.QUOTE, ctx),
      )
      .action(/^.+_unsub$/, async ctx =>
        this.eventService.emit(this.eventService.UNSUB, ctx),
      )
      .action(/^.+_symbol$/, async ctx =>
        this.eventService.emit(this.eventService.SYMBOL, ctx),
      )
      .action(/^.+_language$/, async ctx =>
        this.eventService.emit(this.eventService.LANGUAGE, ctx),
      )
      .action(/^.+_subscribe$/, async ctx =>
        this.eventService.emit(this.eventService.SUBSCRIBE, ctx),
      );
  }

  public async launch(): Promise<void> {
    await this.exchangeService.launch();
    await this.bot.launch();
  }
}
