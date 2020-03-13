import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

import { BaseAction } from '../base.action';

@Injectable()
export class CryptocurrenciesQuoteAction extends BaseAction {

    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_CRYPTOCURRENCIES_QUOTE;
    }

    protected async doAction(chat: ChatInterface, message: MessageInterface): Promise<MessageInterface> {
        try {
            console.log(message);
            return message.setStatus(statuses.STATUS_SUCCESS);
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}