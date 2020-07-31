import { Module, Logger, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigService } from './config.service';
import { AppEmitter } from './event.service';
import { TemplateService } from './template.service';
import { GoogleTimeZoneService } from './google-time-zone.service';
import { UtilService } from './util.service';
import { SchedulerService } from './scheduler.service';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    forwardRef(() => TelegramModule),
    forwardRef(() => DatabaseModule),
    ScheduleModule.forRoot(),
  ],
  providers: [
    { provide: ConfigService, useValue: new ConfigService() },
    { provide: UtilService, useValue: new UtilService() },
    { provide: AppEmitter, useValue: new AppEmitter() },
    { provide: Logger, useValue: new Logger() },
    TemplateService,
    GoogleTimeZoneService,
    SchedulerService,
  ],
  exports: [
    ConfigService,
    Logger,
    AppEmitter,
    TemplateService,
    GoogleTimeZoneService,
    UtilService,
  ],
})
export class CommonModule {}
