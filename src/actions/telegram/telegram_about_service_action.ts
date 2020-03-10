import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { BaseAction } from '../base.action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class AboutServiceAction extends BaseAction {
    
    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_ABOUT_SERVICE;
    }

    protected async doAction(chat: ChatInterface, message: MessageInterface): Promise<MessageInterface> {
        try {
            return message.setStatus(statuses.STATUS_SUCCESS);
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}