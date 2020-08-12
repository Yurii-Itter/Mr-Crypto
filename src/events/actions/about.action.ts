import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable } from '@nestjs/common';

import { Action } from '../action';

@Injectable()
export class AboutAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.ABOUT;
  }

  protected async doAction(ctx: Context): Promise<void> {
    try {
      // return msg;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
