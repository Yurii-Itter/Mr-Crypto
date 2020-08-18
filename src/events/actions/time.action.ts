import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class TimeAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.TIME;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    try {
      const data = this.util.getData(ctx);

      const [parent] = data.match(/^(?:-?[^-]+){9}/);
      const rawTime = data.replace(new RegExp(`${parent}-?`), '');
      const time = rawTime.split('-').map(t => +t);

      let [h, hh, m, mm] = time;

      if (h === 3) {
        h = 0;
      }
      if (h === 2 && hh === 4) {
        hh = 0;
      }
      if (h === 2 && hh >= 4) {
        hh = 0;
      }
      if (hh === 10) {
        hh = 0;
      }
      if (m === 6) {
        m = 0;
      }
      if (mm === 10) {
        mm = 0;
      }

      this.edit = true;
      this.values = {
        parent,
        h: h ? h : 0,
        hh: hh ? hh : 0,
        m: m ? m : 0,
        mm: mm ? mm : 0,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
