import Telegraf from 'telegraf';

import { Injectable, forwardRef, Inject } from '@nestjs/common';

import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { CryptocurrenciesService } from '../cryptocurrencies/cryptocurrencies.service';

import { CommandInterface } from './interfaces/command.interface';
import { KeyboardCommandInterface } from './interfaces/keyboardCommand.interface';

import { TelegramMessage } from './telegram.message';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;

  constructor(
    @Inject(forwardRef(() => 'CryptocurrenciesServiceInstance'))
    cryptocurrenciesService: CryptocurrenciesService,
    config: ConfigService,
    appEmitter: AppEmitter,
  ) {
    const token: string = config.get('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);

    this.getCommandActionMapping(appEmitter).forEach(({ command, event }) => {
      this.setCommandAction(command, event, appEmitter);
    });

    this.getKeyboardCommandsMapping(appEmitter).forEach(
      ({ trigger, event }) => {
        trigger.forEach(tgr => this.setKeyboardAction(tgr, event, appEmitter));
      },
    );

    this.bot.use(async ctx => {
      if (ctx.updateType === 'callback_query') {
        const [, command] = ctx.update.callback_query.data.split('_');
        ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

        switch (command) {
          case 'back':
            appEmitter.emit(
              appEmitter.BASE,
              new TelegramMessage(ctx).withEdit(),
            );
            break;
          case 'sub':
            appEmitter.emit(appEmitter.SUB, new TelegramMessage(ctx));
            break;
          case 'unsub':
            appEmitter.emit(appEmitter.UNSUB, new TelegramMessage(ctx));
            break;
          default:
            appEmitter.emit(appEmitter.QUOTE, new TelegramMessage(ctx));
            break;
        }
      } else if (ctx.updateType === 'message') {
        const { text, location } = ctx.update.message;

        if (cryptocurrenciesService.getBase().includes(text)) {
          appEmitter.emit(appEmitter.BASE, new TelegramMessage(ctx));
        } else if (location) {
          appEmitter.emit(appEmitter.SUB, new TelegramMessage(ctx));
        }
      }
    });
  }

  private getCommandActionMapping(appEmitter: AppEmitter): CommandInterface[] {
    return [{ command: 'start', event: appEmitter.START }];
  }

  private getKeyboardCommandsMapping(
    appEmitter: AppEmitter,
  ): KeyboardCommandInterface[] {
    return [
      {
        trigger: ['Cryptocurrencies 💰', 'Криптовалюты 💰'],
        event: appEmitter.CRYPTOCURRENCIES,
      },
      {
        trigger: ['My Subscriptions ⭐️', 'Мои Подписки ⭐️'],
        event: appEmitter.SUBSCRIPTIONS,
      },
      {
        trigger: ['About Service 🚀', 'О Сервисе 🚀'],
        event: appEmitter.ABOUT,
      },
      {
        trigger: ['Settings ⚙️', 'Настройки ⚙️'],
        event: appEmitter.SETTINGS,
      },
      {
        trigger: ['◀️ Back', '◀️ Назад'],
        event: appEmitter.MENU,
      },
    ];
  }

  private setKeyboardAction(
    trigger: string,
    event: string,
    appEmitter: AppEmitter,
  ): void {
    this.bot.hears(trigger, ctx =>
      appEmitter.emit(event, new TelegramMessage(ctx)),
    );
  }

  private setCommandAction(
    trigger: string,
    event: string,
    appEmitter: AppEmitter,
  ): void {
    this.bot.command(trigger, ctx =>
      appEmitter.emit(event, new TelegramMessage(ctx)),
    );
  }

  public async launch(): Promise<void> {
    await this.bot.launch();
  }
}
