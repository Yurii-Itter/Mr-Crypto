import { Extra, Markup } from 'telegraf';

import { BaseMessage } from '../message/base.message';

import { MessageInterface } from '../message/interfaces/message.interface';
import { ApplyInterface } from '../common/interfaces/apply.interface';
import { KeyboardInterface } from '../common/interfaces/keyboard.interface';

export class TelegramMessage extends BaseMessage implements MessageInterface {
  private ctx: any;

  constructor(ctx: any) {
    super();

    this.ctx = ctx;

    const message =
      this.ctx.updateType === 'callback_query'
        ? this.ctx.update.callback_query.message
        : this.ctx.update.message;

    this.data =
      this.ctx.updateType === 'callback_query'
        ? ctx.update.callback_query.data
        : undefined;

    this.chatId = message.chat.id;
    this.messageId = message.message_id;
    this.text = message.text;
    this.lang = message.from.language_code;
    this.firstName = message.from.first_name;
    this.lastName = message.from.last_name;
  }

  private answerHandler(content: string, edit: boolean, keyboard: any): string {
    return edit
      ? this.ctx.editMessageText(content, keyboard)
      : this.ctx.replyWithHTML(content, keyboard);
  }

  private keyboardHandler(
    type: string,
    edit: boolean,
    keyboard: KeyboardInterface[][],
  ): any {
    return type === 'inline'
      ? Extra.HTML().markup(
          Markup.inlineKeyboard(this.keyboardFormater(type, keyboard)),
        )
      : type === 'keyboard'
      ? Extra.HTML().markup(
          Markup.keyboard(this.keyboardFormater(type, keyboard)).resize(),
        )
      : edit
      ? Extra.HTML()
      : undefined;
  }

  private keyboardFormater(type: string, keyboard: KeyboardInterface[][]) {
    const formated = [];

    keyboard.forEach(kbrd => {
      const k = [];

      kbrd.forEach(({ key, action }) => {
        if (type === 'inline') {
          k.push(Markup.callbackButton(key, action));
        } else if (type === 'keyboard') {
          switch (action) {
            case 'location':
              k.push(Markup.locationRequestButton(key));
              break;
            default:
              k.push(key);
              break;
          }
        }
      });

      formated.push(k);
    });

    return formated;
  }

  public answer(
    { content, type, keyboard }: ApplyInterface,
    edit: boolean,
  ): string {
    return this.answerHandler(
      content,
      edit,
      this.keyboardHandler(type, edit, keyboard),
    );
  }
}
