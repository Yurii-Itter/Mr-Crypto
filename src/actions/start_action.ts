import { Injectable } from '@nestjs/common';

import * as statuses from './statuses';
import { BaseAction } from './base.action';

import { MessageInterface } from '../message/interfaces/message.interface';

@Injectable()
export class StartAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_START;
    }

    protected setButtons(): void {
        this.buttons = [this.appEmitter.TELEGRAM_CRYPTOCURRENCIES, this.appEmitter.TELEGRAM_SUBSCRIPTIONS, this.appEmitter.TELEGRAM_ABOUT_SERVICE, this.appEmitter.TELEGRAM_SETTINGS];
    }

    protected async doAction(chatId: number, message: MessageInterface): Promise<MessageInterface> {
        return message.setStatus(statuses.STATUS_SUCCESS).withData({
            keyboard: this.telegramService.getKeyboardCommandsMapping(this.appEmitter, { lang: message.lang, events: this.buttons })
        });
    }
}