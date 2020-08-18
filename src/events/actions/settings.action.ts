import { Injectable } from '@nestjs/common';

import { Action } from '../action';

import { ChatInterface } from '../../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class SettingsAction extends Action {
  protected setEvent(): void {
    this.event = this.eventService.SETTINGS;
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    this.edit = false;
    this.values = {};
  }
}
