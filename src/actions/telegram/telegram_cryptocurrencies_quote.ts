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

    protected async doAction(chat: ChatInterface, msg: any): Promise<MessageInterface> {
        try {
            return msg.setStatus(statuses.STATUS_SUCCESS).withData({
                symbol_info: msg.ctx.update.callback_query.data
            }).withEdit();
        } catch (error) {
            this.logger.error(error);
        }
    }
}