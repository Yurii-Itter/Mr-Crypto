import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class TimeAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.TIME;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // const [data] = msg.queryData.split('_');
      // const [parent] = data.match(/^(?:-?[^-]+){9}/);
      // const time = data
      //   .replace(new RegExp(`${parent}-?`), '')
      //   .split('-')
      //   .map((t: string) => +t);
      // let [h, hh, m, mm] = time;
      // if (h === 3) {
      //   h = 0;
      // }
      // if (h === 2 && hh >= 4) {
      //   hh = 3;
      // }
      // if (hh === 10) {
      //   hh = 0;
      // }
      // if (m === 6) {
      //   m = 0;
      // }
      // if (mm === 10) {
      //   mm = 0;
      // }
      // return msg.withData({
      //   parent,
      //   h: h ? h : 0,
      //   hh: hh ? hh : 0,
      //   m: m ? m : 0,
      //   mm: mm ? mm : 0,
      // });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
