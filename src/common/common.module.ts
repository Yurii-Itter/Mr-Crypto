import { Module, Logger, forwardRef } from '@nestjs/common';

import { UtilService } from './util.service';
import { EventService } from './event.service';
import { ConfigService } from './config.service';
import { TemplateService } from './template.service';
import { TimeZoneService } from './time-zone.service';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [forwardRef(() => TelegramModule), forwardRef(() => DatabaseModule)],
  providers: [
    { provide: Logger, useValue: new Logger() },
    { provide: UtilService, useValue: new UtilService() },
    { provide: EventService, useValue: new EventService() },
    { provide: ConfigService, useValue: new ConfigService() },
    TemplateService,
    TimeZoneService,
  ],
  exports: [
    Logger,
    UtilService,
    EventService,
    ConfigService,
    TemplateService,
    TimeZoneService,
  ],
})
export class CommonModule {}
