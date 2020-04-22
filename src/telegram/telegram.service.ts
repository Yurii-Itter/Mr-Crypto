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
        @Inject(forwardRef(() => 'CryptocurrenciesServiceInstance')) private cryptocurrenciesService: CryptocurrenciesService,
        config: ConfigService,
        appEmitter: AppEmitter
    ) {
        const token: string = config.get('TELEGRAM_BOT_TOKEN');
        this.bot = new Telegraf(token);

        this.getCommandActionMapping(appEmitter).forEach(({ command, event }) => {
            this.setCommandAction(command, event, appEmitter);
        });

        this.getKeyboardCommandsMapping(appEmitter).forEach(({ trigger, event }) => {
            trigger.forEach(tgr => this.setKeyboardAction(tgr, event, appEmitter));
        });

        this.bot.use(ctx => {
            if (ctx.updateType === 'callback_query') {
                appEmitter.emit(
                    appEmitter.TELEGRAM_CRYPTOCURRENCIES_QUOTE,
                    new TelegramMessage(ctx)
                );
                ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
            } else if (ctx.updateType === 'message' && this.cryptocurrenciesService.getBase().includes(ctx.message.text)) {
                appEmitter.emit(
                    appEmitter.TELEGRAM_CRYPTOCURRENCIES_BASE,
                    new TelegramMessage(ctx)
                );
            }
        });
    }

    private getCommandActionMapping(appEmitter: AppEmitter): Array<CommandInterface> {
        return [
            { command: 'start', event: appEmitter.TELEGRAM_START }
        ];
    }

    private getKeyboardCommandsMapping(appEmitter: AppEmitter): Array<KeyboardCommandInterface> {
        return [
            {
                trigger: ['Cryptocurrencies 💰', 'Криптовалюты 💰'],
                event: appEmitter.TELEGRAM_CRYPTOCURRENCIES
            },
            {
                trigger: ['My Subscriptions ⭐️', 'Мои Подписки ⭐️'],
                event: appEmitter.TELEGRAM_SUBSCRIPTIONS
            },
            {
                trigger: ['About Service 🚀', 'О Сервисе 🚀'],
                event: appEmitter.TELEGRAM_ABOUT_SERVICE
            },
            {
                trigger: ['Settings ⚙️', 'Настройки ⚙️'],
                event: appEmitter.TELEGRAM_SETTINGS
            },
            {
                trigger: ['◀️ Back', '◀️ Назад'],
                event: appEmitter.TELEGRAM_BACK_TO_MAIN_MENU
            }
        ];
    }

    private setKeyboardAction(trigger: string, event: string, appEmitter: AppEmitter): void {
        this.bot.hears(
            trigger, ctx => appEmitter.emit(
                event, new TelegramMessage(ctx)
            )
        );
    }

    private setCommandAction(trigger: string, event: string, appEmitter: AppEmitter): void {
        this.bot.command(
            trigger, ctx => appEmitter.emit(
                event, new TelegramMessage(ctx)
            )
        );
    }

    public launch(): void {
        this.bot.launch();
    }
}
