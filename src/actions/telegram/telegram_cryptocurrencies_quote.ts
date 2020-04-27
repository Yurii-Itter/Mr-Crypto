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
            return message.setStatus(statuses.STATUS_SUCCESS).withData({
                pair_info: 'Duis aliquip non laboris consectetur tempor. Irure mollit proident consectetur id proident aute commodo velit ad labore nisi. Veniam voluptate excepteur ipsum sint nisi. Pariatur aliqua cupidatat adipisicing qui laborum qui enim ea Lorem deserunt incididunt. Aliqua ut mollit non esse adipisicing deserunt exercitation. Non Lorem do reprehenderit elit nisi id voluptate elit excepteur voluptate do minim commodo laborum. Sunt exercitation voluptate aute nisi dolore Lorem occaecat laboris excepteur enim.'
            }).withEdit();
        } catch (error) {
            this.logger.error(error);
        }
    }
}