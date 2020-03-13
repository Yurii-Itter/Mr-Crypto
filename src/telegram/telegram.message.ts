import { BaseMessage } from '../message/base.message';
import { Extra, Markup } from 'telegraf'

import { MessageInterface } from '../message/interfaces/message.interface';
import { ApplyInterface } from '../common/interfaces/apply.interface';

export class TelegramMessage extends BaseMessage implements MessageInterface {
    private ctx: any;

    constructor(ctx) {
        super();

        this.ctx = ctx;

        let message;

        if (this.ctx.updateType === 'callback_query') {
            message = this.ctx.update.callback_query.message;
            this.data = this.ctx.update.callback_query.data;
        } else if (this.ctx.updateType === 'message') {
            message = this.ctx.update.message;
        }

        this.chatId = message.chat.id;
        this.text = message.text;
        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    public answer({ content, inline, keyboard }: ApplyInterface): string | void {

        if (keyboard) {
            return this.ctx.replyWithHTML(content,
                Extra.markup(Markup.keyboard(keyboard).resize())
            );
        } else if (inline) {
            return this.ctx.replyWithHTML(content,
                Extra.markup(
                    Markup.inlineKeyboard(
                        (
                            () => {
                                let keyboard = [];
                                inline.forEach(i => {
                                    let k = [];
                                    i.forEach(quote => k.push(Markup.callbackButton(quote.key, quote.action)));
                                    keyboard.push(k);
                                })
                                return keyboard;
                            }
                        )()
                    )
                )
            );
        }

        return this.ctx.replyWithHTML(content);
    }
}