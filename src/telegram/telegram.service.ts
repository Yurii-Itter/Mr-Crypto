import Telegraf from 'telegraf';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config.service';

@Injectable()
export class TelegramService {
    private bot: Telegraf<any>;

    constructor(config: ConfigService) {
        const token: string = config.get('TELEGRAM_BOT_TOKEN');
        this.bot = new Telegraf(token);
    }

    public launch(): void {
        this.bot.launch();
    }
}
