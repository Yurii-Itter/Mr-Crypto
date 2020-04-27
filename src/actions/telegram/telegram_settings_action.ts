import { Injectable } from '@nestjs/common';

import * as statuses from '../statuses';
import { BaseAction } from '../base.action';

import { MessageInterface } from '../../message/interfaces/message.interface';
import { ChatInterface } from '../../database/interfaces/chat.interface';

@Injectable()
export class SettingsAction extends BaseAction {
    
    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_SETTINGS;
    }

    protected async doAction(chat: ChatInterface, msg: any): Promise<MessageInterface> {
        try {
            return msg.setStatus(statuses.STATUS_SUCCESS);
        } catch (error) {
            this.logger.error(error);
        }
    }
}