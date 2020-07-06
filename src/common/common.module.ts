import { Module, Logger } from '@nestjs/common';

import { ConfigService } from './config.service';
import { AppEmitter } from './event.service';
import { TemplateService } from './template.service';
import { GoogleTimeZoneService } from './google-time-zone.service';

@Module({
  providers: [
    { provide: ConfigService, useValue: new ConfigService() },
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
  ],
})
export class CommonModule {}
