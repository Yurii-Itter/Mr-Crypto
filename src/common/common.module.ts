import { Module, Logger } from '@nestjs/common';
import { ConfigService } from './config.service';
import { AppEmitter } from './event.service';

@Module({
    providers: [
        { provide: ConfigService, useValue: new ConfigService() },
        { provide: AppEmitter, useValue: new AppEmitter() },
        { provide: Logger, useValue: new Logger() },
    ],
    exports: [ConfigService, Logger, AppEmitter],
})
export class CommonModule { }