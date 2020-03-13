import { Module, forwardRef } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { CryptocurrenciesModule } from '../cryptocurrencies/cryptocurrencies.module';

import { TelegramService } from './telegram.service';

@Module({
    imports: [forwardRef(() => CryptocurrenciesModule), CommonModule],
    providers: [
        TelegramService,
        {
            provide: 'TelegramServiceInstance',
            useFactory: (telegramService: TelegramService) => {
                return telegramService;
            },
            inject: [TelegramService]
        }
    ],
    exports: ['TelegramServiceInstance'],
})
export class TelegramModule { }