import Telegraf from 'telegraf';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { TelegramMessage } from './telegram.message';

@Injectable()
export class TelegramService {
    private bot: Telegraf<any>;

    constructor(config: ConfigService, appEmitter: AppEmitter) {
        const token: string = config.get('TELEGRAM_BOT_TOKEN');
        this.bot = new Telegraf(token);

        this.setCommandActionMapping(appEmitter).forEach(({ command, event }) => {
            this.bot.command(command, ctx => {
                ctx.command = command;
                appEmitter.emit(event, new TelegramMessage(ctx));
            });
        });

        this.setKeyboardActionMapping(appEmitter);
    }

    private setCommandActionMapping(appEmitter: AppEmitter): Array<any> {
        return [
            { command: 'start', event: appEmitter.TELEGRAM_START }
        ]
    }

    private setKeyboardActionMapping(appEmitter: AppEmitter): Array<any> {
        return [
            {
                event: appEmitter.TELEGRAM_CRYPTOCURRENCIES,
                keyboard: [
                    { lang: 'en', title: 'Cryptocurrencies 💰' },
                    { lang: 'ru', title: 'Криптовалюты 💰' },
                ]
            },
            {
                event: appEmitter.TELEGRAM_SUBSCRIPTIONS,
                keyboard: [
                    { lang: 'en', title: 'My Subscriptions ⭐️' },
                    { lang: 'ru', title: 'Мои Подписки ⭐️' },
                ]
            },
            {
                event: appEmitter.TELEGRAM_ABOUT_SERVICE,
                keyboard: [
                    { lang: 'en', title: 'About Service 🚀' },
                    { lang: 'ru', title: 'О Сервисе 🚀' },
                ]
            },
            {
                event: appEmitter.TELEGRAM_SETTINGS,
                keyboard: [
                    { lang: 'en', title: 'Settings ⚙️' },
                    { lang: 'ru', title: 'Настройки ⚙️' },
                ]
            }
        ]
    }

    public launch(): void {
        this.bot.launch();
    }
}
