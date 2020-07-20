import { Module, Logger } from '@nestjs/common';

import { ConfigService } from './config.service';
import { AppEmitter } from './event.service';
import { TemplateService } from './template.service';
import { GoogleTimeZoneService } from './google-time-zone.service';
import { UtilService } from './util.service';

@Module({
  providers: [
    { provide: ConfigService, useValue: new ConfigService() },
    { provide: UtilService, useValue: new UtilService() },
    { provide: AppEmitter, useValue: new AppEmitter() },
    { provide: Logger, useValue: new Logger() },
    TemplateService,
    GoogleTimeZoneService,
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
