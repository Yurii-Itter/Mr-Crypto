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
      const time = data
        .replace(new RegExp(`${parent}-?`), '')
        .split('-')
        .map((t: string) => +t);

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

      const { text, extra } = this.templateService.apply(
        chat.language_code,
        this.event,
        {
          parent,
          h: h ? h : 0,
          hh: hh ? hh : 0,
          m: m ? m : 0,
          mm: mm ? mm : 0,
        }
      );

      await ctx.editMessageText(text, extra);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
