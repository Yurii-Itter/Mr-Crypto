import { Message } from 'telegraf/typings/telegram-types';

import { Injectable } from '@nestjs/common';

import { CreateChatDto } from '../database/dto/create-chat.dto';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class UtilService {
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
    const { first_name, last_name } = from;
    let { language_code } = from;
    const { id } = chat;

    if (!language_code) {
      language_code = 'en';
    }

    return { id, first_name, last_name, language_code };
  }

  public chunk(data: any[], size: number): any[][] {
    let chunk = [];

    return data.reduce((accum, quote, index, array) => {
      if (chunk.length === size || index === array.length - 1) {
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
    const formated = value
      .replace(/^(-?[1-9]\d*)$/, '$1' + '.00')
      .replace(/^(-?[1-9]\d*\.\d)$/, '$1' + '0');

    return formated.match(/^-?[1-9]\d*\./)
      ? formated.replace(/(\.\d{2}).*/, '$1')
      : formated.replace(/0+$/, '');
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
      .replace(/(\.\d{2}).*/, '$1');
  }

  public sort(symbols: string[], bases: string[], quotes: string[]): string[] {
    return symbols.sort((a, b) => {
      const [aBase, aQuote] = a.split('-');
      const [bBase, bQuote] = b.split('-');

      if (bases.indexOf(aBase) > bases.indexOf(bBase)) {
        return 1;
      }

      if (bases.indexOf(aBase) < bases.indexOf(bBase)) {
        return -1;
      }

      if (quotes.indexOf(aQuote) > quotes.indexOf(bQuote)) {
        return 1;
      }

      if (quotes.indexOf(aQuote) < quotes.indexOf(bQuote)) {
        return -1;
      }

      return 0;
    });
  }

  public allowed(raw: string[], bases: string[], quotes: string[]): string[] {
    return raw.filter(symbol => {
      const [base, quote] = symbol.split('-');
      return bases.includes(base) && quotes.includes(quote);
    });
  }

  public fiat(quote: string): string {
    switch (quote) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'RUB':
        return '₽';
      default:
        return '';
    }
  }

  public num(days: string[]): number[] {
    return days.reduce((accum: number[], day, index) => {
      if (day.search('on') != -1) {
        accum.push(index + 1);
      }

      return accum;
    }, []);
  }

  public days(nums: number[], language_code: string): string {
    let days = '';

    nums.forEach(num => {
      if (language_code === 'en') {
        if (num === 1) {
          days = days.concat('Monday ');
        }

        if (num === 2) {
          days = days.concat('Tuesday ');
        }

        if (num === 3) {
          days = days.concat('Wednesday ');
        }

        if (num === 4) {
          days = days.concat('Thursday ');
        }

        if (num === 5) {
          days = days.concat('Friday ');
        }

        if (num === 6) {
          days = days.concat('Saturday ');
        }

        if (num === 7) {
          days = days.concat('Sunday');
        }
      } else if (language_code === 'ru') {
        if (num === 1) {
          days = days.concat('Понедельник ');
        }

        if (num === 2) {
          days = days.concat('Вторник ');
        }

        if (num === 3) {
          days = days.concat('Среда ');
        }

        if (num === 4) {
          days = days.concat('Четверг ');
        }

        if (num === 5) {
          days = days.concat('Пятница ');
        }

        if (num === 6) {
          days = days.concat('Суббота ');
        }

        if (num === 7) {
          days = days.concat('Воскресенье');
        }
      }
    });

    return days
      .replace(/\s$/, '')
      .replace(/\s/g, ', ')
      .replace(/^Saturday, Sunday$/, 'On weekends')
      .replace(/^Суббота, Воскресенье$/, 'По выходным')
      .replace(/^Понедельник, Вторник, Среда, Четверг, Пятница$/, 'По будним')
      .replace(/^Monday, Tuesday, Wednesday, Thursday, Friday$/, 'On weekdays')
      .replace(
        /^Понедельник, Вторник, Среда, Четверг, Пятница, Суббота, Воскресенье$/,
        'Каждый день',
      )
      .replace(
        /^Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday$/,
        'Every day',
      );
  }
}
