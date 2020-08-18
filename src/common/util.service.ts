import { Message } from 'telegraf/typings/telegram-types';

import { Injectable } from '@nestjs/common';

import { CreateChatDto } from '../database/dto/create-chat.dto';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class UtilService {
  public chunk(data: any[]): any[][] {
    let chunk = [];

    return data.reduce((accum, quote, index, array) => {
      if (chunk.length === 2 || index === array.length - 1) {
        chunk.push(quote);
        accum.push({ chunk });
        chunk = [];
      } else {
        chunk.push(quote);
      }

      return accum;
    }, []);
  }

  public cut(value: string): string {
    return value.match(/-?[1-9]\d*\./)
      ? value.replace(/(\.\d{2}).*/, '$1')
      : value.replace(/0+$/, '');
  }

  public change(last: string, open: string): string {
    return (+last - +open)
      .toString()
      .substring(0, last.length + 1)
      .replace(/0+$/, '');
  }

  public percent(last: string, open: string): string {
    return ((+this.change(last, open) * 100) / +open)
      .toString()
      .substring(0, 4)
      .replace(/0+$/, '');
  }

  public getMessage(ctx: Context): Message {
    return ctx.update.message
      ? ctx.update.message
      : ctx.update.callback_query.message;
  }

  public getData(ctx: Context): string {
    return ctx.update.message
      ? ctx.update.message.text
      : ctx.update.callback_query.data.split('_')[0];
  }

  public isCallback(ctx: Context): boolean {
    return ctx.update.callback_query ? true : false;
  }

  public getChatData(ctx: Context): CreateChatDto {
    const { from, chat } = this.getMessage(ctx);
    const { first_name, last_name, language_code } = from;
    const { id } = chat;

    return { id, first_name, last_name, language_code };
  }
}
