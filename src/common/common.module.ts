import { Module, Logger } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
    providers: [
        { provide: ConfigService, useValue: new ConfigService() },
        { provide: Logger, useValue: new Logger() },
    ],
    exports: [ConfigService, Logger],
})
export class CommonModule { }