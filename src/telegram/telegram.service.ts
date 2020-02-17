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
    }

    private setCommandActionMapping(appEmitter: AppEmitter): Array<any> {
        return [
            { command: 'start', event: appEmitter.TELEGRAM_START }
        ]
    }

    public launch(): void {
        this.bot.launch();
    }
}
