import { TelegrafContext as Context } from 'telegraf/typings/context';

import { Injectable, Inject, Logger } from '@nestjs/common';

import { UtilService } from '../common/util.service';
import { EventService } from '../common/event.service';
import { ConfigService } from '../common/config.service';
import { TemplateService } from '../common/template.service';
import { TimeZoneService } from '../common/time-zone.service';
import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchanges/exchange.service';

@Injectable()
export class Action {
  protected event: string;
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

    this.logger.log(`subscribed on ${this.event} event`);
    this.eventService.on(this.event, this.doAction.bind(this));
  }

  protected setEvent(): void {
    throw new Error('not implemented');
  }

  protected async doAction(ctx: Context): Promise<void> {
    throw new Error('not implemented');
  }
}
