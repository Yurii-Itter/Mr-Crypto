import { BaseMessage } from '../message/base.message';
import { MessageInterface } from '../message/interfaces/message.interface';
import { ApplyInterface } from '../common/interfaces/apply.interface';

import { Extra, Markup } from 'telegraf'

export class TelegramMessage extends BaseMessage implements MessageInterface {
    private ctx: any;

    constructor(ctx) {
        super();

        this.ctx = ctx;

        const { message } = this.ctx.update;
        this.chatId = message.chat.id;
        this.text = message.text;
        this.command = this.ctx.command;
        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    public answer({ htmlText, keyboard }: ApplyInterface): string | void {
        if (keyboard) {
            return this.ctx.replyWithHTML(htmlText, Extra.markup(Markup.keyboard(keyboard)));
        } else {
            return this.ctx.replyWithHTML(htmlText);
        }
    }
}