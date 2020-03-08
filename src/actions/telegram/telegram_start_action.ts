import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { BaseAction } from '../base.action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class StartAction extends BaseAction {

    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_START;
    }

    protected setButtons(): void {
        this.buttons = [this.appEmitter.TELEGRAM_CRYPTOCURRENCIES, this.appEmitter.TELEGRAM_SUBSCRIPTIONS, this.appEmitter.TELEGRAM_ABOUT_SERVICE, this.appEmitter.TELEGRAM_SETTINGS];
    }

    protected async doAction(chat: ChatInterface, message: MessageInterface): Promise<MessageInterface> {
        try {
            return message.setStatus(statuses.STATUS_SUCCESS).withData(this.telegramService.getKeyboardCommandsMapping(this.appEmitter, { lang: message.lang, events: this.buttons }));
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}