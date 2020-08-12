import { Telegraf, Telegram } from 'telegraf';

import { Injectable, Inject, Logger } from '@nestjs/common';

import { EventService } from '../common/event.service';
import { ConfigService } from '../common/config.service';
import { ExchangeService } from '../exchanges/exchange.service';

@Injectable()
export class TelegramService {
  private logger: Logger;

  private bot: Telegraf<any>;
  private eventService: EventService;
  private exchangeService: ExchangeService;

  public telegram: Telegram;

  constructor(
    @Inject('ExchangeServiceInstance')
    exchangeService: ExchangeService,
    configService: ConfigService,
    eventService: EventService,
    logger: Logger,
  ) {
    const token = configService.get('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);

    this.logger = logger;
    this.eventService = eventService;
    this.telegram = this.bot.telegram;
    this.exchangeService = exchangeService;

    this.bot.start(async ctx =>
      this.eventService.emit(this.eventService.START, ctx),
    );

    this.bot.on('location', async ctx =>
      this.eventService.emit(this.eventService.CRYPTOCURRENCIES, ctx),
    );

    this.bot
      .hears(['◀️ Back', '◀️ Назад'], async ctx =>
        this.eventService.emit(this.eventService.MENU, ctx),
      )
      .hears(['Settings ⚙️', 'Настройки ⚙️'], async ctx =>
        this.eventService.emit(this.eventService.SETTINGS, ctx),
      )
      .hears(['About Service 🚀', 'О Сервисе 🚀'], async ctx =>
        this.eventService.emit(this.eventService.ABOUT, ctx),
      )
      .hears(['My Subscriptions ⭐️', 'Мои Подписки ⭐️'], async ctx =>
        this.eventService.emit(eventService.SUBSCRIPTIONS, ctx),
      )
      .hears(['Cryptocurrencies 💰', 'Криптовалюты 💰'], async ctx =>
        this.eventService.emit(this.eventService.CRYPTOCURRENCIES, ctx),
      );

    this.bot
      .action(/^.+_base$/, async ctx =>
        this.eventService.emit(this.eventService.BASE, ctx),
      )
      .action(/^.+_days$/, async ctx =>
        this.eventService.emit(this.eventService.DAYS, ctx),
      )
      .action(/^.+_time$/, async ctx =>
        this.eventService.emit(this.eventService.TIME, ctx),
      )
      .action(/^.+_unsub$/, async ctx =>
        this.eventService.emit(this.eventService.UNSUB, ctx),
      )
      .action(/^.+_quote$/, async ctx =>
        this.eventService.emit(this.eventService.QUOTE, ctx),
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
