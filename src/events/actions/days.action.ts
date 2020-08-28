import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class DaysAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.DAYS;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const { timeZoneId, language_code } = chat;

      if (!timeZoneId) {
        const action = this.eventService.TIMEZONE;

        const template = this.templateService.apply(language_code, action, {});
        const { text, extra } = template;

        await ctx.deleteMessage();
        await ctx.reply(text, extra);
      } else {
        const action = this.eventService.DAYS;

        const [base, symbol] = data.split('-');
        const options = base ? false : true;

        let days = data
          .replace(new RegExp(`${base}-${symbol}-?`), '')
          .split('-');

        if (days.filter(day => day === 'on').length === 1) {
          if (days.filter(day => day === 'son').length === 1) {
            days = days.map(day => (day === 'son' ? 'on' : day));
          } else {
            days = days.map(day => (day === 'on' ? 'son' : day));
          }
        }

        if (days.every(day => day === 'off' || day === 'soff')) {
          const allowed = days.reduce(
            (accum: number[], day: string, index: number) => {
              if (day !== 'soff') {
                accum.push(index);
              }
              return accum;
            },
            [],
          );
          days[allowed[Math.floor(Math.random() * allowed.length)]] = 'son';
          days = days.map(day => (day === 'soff' ? 'off' : day));
        }

        const [mon, tue, wed, thu, fri, sat, sun] = days;

        const template = this.templateService.apply(language_code, action, {
          base,
          symbol,
          options,
          mon: mon ? mon : 'on',
          tue: tue ? tue : 'on',
          wed: wed ? wed : 'on',
          thu: thu ? thu : 'on',
          fri: fri ? fri : 'on',
          sat: sat ? sat : 'on',
          sun: sun ? sun : 'on',
        });
        const { text, extra } = template;

        await ctx.editMessageText(text, extra);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
