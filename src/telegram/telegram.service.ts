import Telegraf from 'telegraf';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { TelegramMessage } from './telegram.message';

import { CommandInterface } from './interfaces/command.interface';
import { GetKeyboard } from './interfaces/getKeyboard.interface';
import { KeyboardCommandInterface } from './interfaces/keyboardCommand.interface';

@Injectable()
export class TelegramService {
    private bot: Telegraf<any>;

    constructor(config: ConfigService, appEmitter: AppEmitter) {
        const token: string = config.get('TELEGRAM_BOT_TOKEN');
        this.bot = new Telegraf(token);

        this.getCommandActionMapping(appEmitter).forEach(({ command, event }) => {
            this.bot.command(command, ctx => {
                ctx.command = command;
                appEmitter.emit(event, new TelegramMessage(ctx));
            });
        });

        this.getKeyboardCommandsMapping(appEmitter).forEach(({ keyboard, event }) => {
            keyboard.forEach(({ title }) => {
                this.bot.hears(title, ctx => {
                    ctx.command = title;
                    appEmitter.emit(event, new TelegramMessage(ctx))
                })
            })
        })
    }

    private getCommandActionMapping(appEmitter: AppEmitter): Array<CommandInterface> {
        return [
            { command: 'start', event: appEmitter.TELEGRAM_START }
        ]
    }

    private keyboardCommands(appEmitter: AppEmitter): Array<KeyboardCommandInterface> {
        return [
            {
                keyboard: [
                    { lang: 'en', title: 'Cryptocurrencies 💰' },
                    { lang: 'ru', title: 'Криптовалюты 💰' },
                ],
                event: appEmitter.TELEGRAM_CRYPTOCURRENCIES
            },
            {
                keyboard: [
                    { lang: 'en', title: 'My Subscriptions ⭐️' },
                    { lang: 'ru', title: 'Мои Подписки ⭐️' },
                ],
                event: appEmitter.TELEGRAM_SUBSCRIPTIONS
            },
            {
                keyboard: [
                    { lang: 'en', title: 'About Service 🚀' },
                    { lang: 'ru', title: 'О Сервисе 🚀' },
                ],
                event: appEmitter.TELEGRAM_ABOUT_SERVICE
            },
            {
                keyboard: [
                    { lang: 'en', title: 'Settings ⚙️' },
                    { lang: 'ru', title: 'Настройки ⚙️' },
                ],
                event: appEmitter.TELEGRAM_SETTINGS
            }
        ]
    }

    public getKeyboardCommandsMapping(appEmitter: AppEmitter, key?: GetKeyboard): Array<KeyboardCommandInterface> | any {
        if (key) {
            let kb = {};
            key.events.forEach(event => { kb[event] = this.keyboardCommands(appEmitter).find(ke => ke.event === event).keyboard.find(lng => lng.lang === key.lang).title });
            return kb;
        } else {
            return this.keyboardCommands(appEmitter);
        }
    }

    public launch(): void {
        this.bot.launch();
    }
}
