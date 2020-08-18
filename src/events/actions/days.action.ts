import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class DayAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.DAYS;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const { timeZoneId } = chat;

      if (!timeZoneId) {
        this.action = this.eventService.TIMEZONE;
      } else {
        const data = this.util.getData(ctx);

        const [parent] = data.match(/^(?:-?[^-]+){2}/);
        let days = data.replace(new RegExp(`${parent}-?`), '').split('-');

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

        this.edit = true;
        this.values = {
          parent,
          mon: mon ? mon : 'on',
          tue: tue ? tue : 'on',
          wed: wed ? wed : 'on',
          thu: thu ? thu : 'on',
          fri: fri ? fri : 'on',
          sat: sat ? sat : 'on',
          sun: sun ? sun : 'on',
        };
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
