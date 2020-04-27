import { Extra, Markup } from 'telegraf';

import { BaseMessage } from '../message/base.message';

import { MessageInterface } from '../message/interfaces/message.interface';
import { ApplyInterface } from '../common/interfaces/apply.interface';
import { InlineInterface } from '../common/interfaces/inline.interface';

export class TelegramMessage extends BaseMessage implements MessageInterface {

    private ctx: any;

    constructor(ctx: any) {
        super();

        this.ctx = ctx;

        const message = this.ctx.updateType === 'callback_query' ?
            this.ctx.update.callback_query.message :
            this.ctx.update.message;

        this.chatId = message.chat.id;
        this.messageId = message.messageId;
        this.text = message.text;
        this.lang = message.from.language_code;
        this.firstName = message.from.first_name;
        this.lastName = message.from.last_name;
    }

    private answerHandler(
        content: string,
        inline: Array<Array<InlineInterface>>,
        keyboard: Array<Array<string>>
    ): string {
        if (inline) {
            return this.ctx.replyWithHTML(content, this.inlineHandler(inline));
        } else if (keyboard) {
            return this.ctx.replyWithHTML(content, this.keyboardHandler(keyboard));
        } else {
            return this.ctx.replyWithHTML(content);
        }
    }

    private editHandler(
        content: string,
        inline: Array<Array<InlineInterface>>
    ): string {
        if (inline) {
            return this.ctx.editMessageText(content, this.inlineHandler(inline));
        } else {
            return this.ctx.editMessageText(content);
        }
    }

    private keyboardHandler(keyboard: Array<Array<string>>): any {
        return Extra.markup(
            Markup.keyboard(keyboard).resize()
        )
    }

    private inlineHandler(inline: Array<Array<InlineInterface>>): any {
        return Extra.markup(Markup.inlineKeyboard
            (
                (
                    () => {
                        let keyboard = [];
                        inline.forEach(i => {
                            let k = [];
                            i.forEach(
                                quote => k.push(
                                    Markup.callbackButton(quote.key, quote.action)
                                )
                            );
                            keyboard.push(k);
                        })
                        return keyboard;
                    }
                )()
            )
        )
    }

    public answer({ content, keyboard, inline }: ApplyInterface, edit: boolean): string {
        if (edit) {
            return this.editHandler(content, inline);
        } else {
            return this.answerHandler(content, inline, keyboard);
        }
    }
}