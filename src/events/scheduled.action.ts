import { CronJob } from 'cron';

import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable, Inject, Logger } from '@nestjs/common';

import { NameService } from '../common/name.service';
import { UtilService } from '../common/util.service';
import { EventService } from '../common/event.service';
import { ConfigService } from '../common/config.service';
import { TemplateService } from '../common/template.service';
import { TimeZoneService } from '../common/time-zone.service';
import { DatabaseService } from '../database/database.service';
import { TelegramService } from '../telegram/telegram.service';
import { ExchangeService } from '../exchanges/exchange.service';

import { Telegram } from 'telegraf/typings/telegram';

@Injectable()
export class ScheduledAction {
  protected logger: Logger;
  protected jobName: string;
  protected util: UtilService;
  protected telegram: Telegram;
  protected jobInterval: string;
  protected config: ConfigService;
  protected nameService: NameService;
  protected eventService: EventService;
  protected templateService: TemplateService;
  protected databaseService: DatabaseService;
  protected timeZoneService: TimeZoneService;
  protected exchangeService: ExchangeService;

  private scheduler: SchedulerRegistry;

  constructor(
    @Inject('ExchangeServiceInstance')
    exchangeService: ExchangeService,
    @Inject('TelegramServiceInstance')
    telegramService: TelegramService,
    timeZoneService: TimeZoneService,
    templateService: TemplateService,
    databaseService: DatabaseService,
    scheduler: SchedulerRegistry,
    eventService: EventService,
    nameService: NameService,
    config: ConfigService,
    util: UtilService,
    logger: Logger,
  ) {
    this.util = util;
    this.config = config;
    this.logger = logger;
    this.scheduler = scheduler;
    this.nameService = nameService;
    this.eventService = eventService;
    this.templateService = templateService;
    this.databaseService = databaseService;
    this.timeZoneService = timeZoneService;
    this.exchangeService = exchangeService;
    this.telegram = telegramService.telegram;

    this.setJobName();
    this.setJobInterval();
    this.declareJob();
  }

  protected setJobName(): void {
    throw new Error('not implemented');
  }

  protected setJobInterval(): void {
    throw new Error('not implemented');
  }

  protected async doAction(): Promise<void> {
    throw new Error('not implemented');
  }

  private declareJob(): void {
    const job = new CronJob(this.jobInterval, () => this.doAction());
    this.scheduler.addCronJob(this.jobName, job);
    job.start();
  }
}
