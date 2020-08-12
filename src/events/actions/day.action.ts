import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class DayAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.DAYS;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // if (!chat.timeZone) {
      //   return msg.withAction(this.eventService.TIMEZONE);
      // }
      // const [data] = msg.queryData.split('_');
      // const [parent] = data.match(/^(?:-?[^-]+){2}/);
      // let days = data.replace(new RegExp(`${parent}-?`), '').split('-');
      // if (days.filter((day: string) => day === 'on').length === 1) {
      //   if (days.filter((day: string) => day === 'son').length === 1) {
      //     days = days.map((day: string) => (day === 'son' ? 'on' : day));
      //   } else {
      //     days = days.map((day: string) => (day === 'on' ? 'son' : day));
      //   }
      // }
      // if (days.every((day: string) => day === 'off' || day === 'soff')) {
      //   const allowed = days.reduce(
      //     (accum: number[], day: string, index: number) => {
      //       if (day !== 'soff') {
      //         accum.push(index);
      //       }
      //       return accum;
      //     },
      //     [],
      //   );
      //   days[allowed[Math.floor(Math.random() * allowed.length)]] = 'son';
      //   days = days.map((day: string) => (day === 'soff' ? 'off' : day));
      // }
      // const [
      //   monday,
      //   tuesday,
      //   wednesday,
      //   thursday,
      //   friday,
      //   saturday,
      //   sunday,
      // ] = days;
      // return msg.withData({
      //   parent,
      //   monday: monday ? monday : 'on',
      //   tuesday: tuesday ? tuesday : 'on',
      //   wednesday: wednesday ? wednesday : 'on',
      //   thursday: thursday ? thursday : 'on',
      //   friday: friday ? friday : 'on',
      //   saturday: saturday ? saturday : 'on',
      //   sunday: sunday ? sunday : 'on',
      // });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
