import { Extra, Markup, Telegram } from 'telegraf';

import { TelegramMessageInterface } from './interfaces/message.interface';
import { ApplyInterface } from '../common/interfaces/apply.interface';
import { KeyboardInterface } from '../common/interfaces/keyboard.interface';

import { Message } from 'telegraf/typings/telegram-types';

export class TelegramMessage implements TelegramMessageInterface {
  public chatId: number;
  public messageId: number;
  public lang: string;
  public text: string;
  public data: any;
  public firstName: string;
  public lastName: string;
  public location: any;
  public edit: boolean;
  public subscription: boolean;

  protected replyData: any;
  protected replyAction: string;

  private ctx: any;
  private telegram: Telegram;

  constructor(ctx: any, telegram: Telegram) {
    this.ctx = ctx;
    this.telegram = telegram;

    const message =
      this.ctx.updateType === 'callback_query'
        ? this.ctx.update.callback_query.message
        : this.ctx.update.message;

    this.data =
      this.ctx.updateType === 'callback_query'
        ? this.ctx.update.callback_query.data
        : undefined;

    this.chatId = message.chat.id;
    this.messageId = message.message_id;
    this.text = message.text;
    this.lang = message.from.language_code;
    this.firstName = message.from.first_name;
    this.lastName = message.from.last_name;
    this.location = message.location;
    this.subscription = message.subscription;
  }

  private async answerHandler(
    content: string,
    edit: boolean,
    keyboard: any,
  ): Promise<boolean | Message> {
    return edit
      ? this.telegram.editMessageText(
          this.chatId,
          this.messageId,
          null,
          content,
          keyboard,
        )
      : this.telegram.sendMessage(this.chatId, content, keyboard);
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

  public getReplyData(): any {
    return this.replyData;
  }

  public getReplyAction(): string {
    return this.replyAction;
  }

  public withAction(action: string): TelegramMessageInterface {
    this.replyAction = action;
    return this;
  }

  public withData(data: any): TelegramMessageInterface {
    this.replyData = this.replyData ? { ...this.replyData, ...data } : data;
    return this;
  }

  public withEdit(): TelegramMessageInterface {
    this.edit = true;
    return this;
  }

  public withoutEdit(): TelegramMessageInterface {
    this.edit = false;
    return this;
  }

  public answer(
    { content, type, keyboard }: ApplyInterface,
    edit: boolean,
  ): Promise<boolean | Message> {
    return this.answerHandler(
      content,
      edit,
      this.keyboardHandler(type, edit, keyboard),
    );
  }
}
