import { Module } from '@nestjs/common';

import { StartAction } from './telegram/telegram_start_action';
import { CryptocurrenciesAction } from './telegram/telegram_cryptocurrencies_action';
import { SubscriptionsAction } from './telegram/telegram_subscriptions_action';
import { AboutServiceAction } from './telegram/telegram_about_service_action';
import { SettingsAction } from './telegram/telegram_settings_action';

import { CryptocurrenciesModule } from '../cryptocurrencies/cryptocurrencies.module';

import { CommonModule } from '../common/common.module';
import { TelegramModule } from '../telegram/telegram.module';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [CommonModule, TelegramModule, DatabaseModule, CryptocurrenciesModule],
    providers: [StartAction, CryptocurrenciesAction, SubscriptionsAction, AboutServiceAction, SettingsAction],
    exports: [StartAction, CryptocurrenciesAction, SubscriptionsAction, AboutServiceAction, SettingsAction],
})
export class ActionModule { }