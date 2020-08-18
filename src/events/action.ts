import { Injectable, Inject, Logger } from '@nestjs/common';

import { UtilService } from '../common/util.service';
import { EventService } from '../common/event.service';
import { ConfigService } from '../common/config.service';
import { TemplateService } from '../common/template.service';
import { TimeZoneService } from '../common/time-zone.service';
import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchanges/exchange.service';

import { ChatInterface } from '../database/interfaces/chat.interface';

import { TelegrafContext as Context } from 'telegraf/typings/context';

@Injectable()
export class Action {
  protected values: any;
  protected lang: string;
  protected event: string;
  protected edit: boolean;
  protected action: string;
  protected logger: Logger;
  protected util: UtilService;
  protected config: ConfigService;
  protected eventService: EventService;
  protected templateService: TemplateService;
  protected databaseService: DatabaseService;
  protected timeZoneService: TimeZoneService;
  protected exchangeService: ExchangeService;

  constructor(
    @Inject('ExchangeServiceInstance')
    exchangeService: ExchangeService,
    timeZoneService: TimeZoneService,
    templateService: TemplateService,
    databaseService: DatabaseService,
    eventService: EventService,
    config: ConfigService,
    util: UtilService,
    logger: Logger,
  ) {
    this.util = util;
    this.config = config;
    this.logger = logger;
    this.eventService = eventService;
    this.templateService = templateService;
    this.databaseService = databaseService;
    this.timeZoneService = timeZoneService;
    this.exchangeService = exchangeService;

    this.setEvent();
    this.action = this.event;

    this.logger.log(`subscribed on ${this.event} event`);
    this.eventService.on(this.event, this.handleEvent.bind(this));
  }

  protected setEvent(): void {
    throw new Error('not implemented');
  }

  protected async doAction(ctx: Context, chat: ChatInterface): Promise<void> {
    throw new Error('not implemented');
  }

  private async handleEvent(ctx: Context): Promise<void> {
    const chatData = this.util.getChatData(ctx);
    const chat = await this.databaseService.ensureChat(chatData);

    const { language_code } = chat;
    this.lang = language_code;

    await this.doAction(ctx, chat);

    const { text, extra } = this.templateService.apply(
      this.lang,
      this.action,
      this.values,
    );

    this.edit ? ctx.editMessageText(text, extra) : ctx.reply(text, extra);
  }
}
