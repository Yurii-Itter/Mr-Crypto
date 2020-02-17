import { Injectable } from '@nestjs/common';

import * as statuses from './statuses';
import { BaseAction } from './base.action';
import { MessageInterface } from '../message/interfaces/message.interface';

@Injectable()
export class StartAction extends BaseAction {
    protected setEvent(): void {
        this.event = this.appEmitter.TELEGRAM_START;
    }

    protected async doAction(chat: number, message: MessageInterface): Promise<MessageInterface> {
        return message.setStatus(statuses.STATUS_SUCCESS).withData({
            date: "123",
        });
    }
}