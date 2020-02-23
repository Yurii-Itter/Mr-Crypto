import { Injectable } from '@nestjs/common';

import * as statuses from './statuses';
import { BaseAction } from './base.action';

import { MessageInterface } from '../message/interfaces/message.interface';

@Injectable()
export class SubscriptionsAction extends BaseAction {
    
    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_SUBSCRIPTIONS;
    }

    protected setButtons(): void {
        this.buttons = [];
    }

    protected async doAction(chatId: number, message: MessageInterface): Promise<MessageInterface> {
        try {
            return message.setStatus(statuses.STATUS_SUCCESS);
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}