import { Module } from '@nestjs/common';

import { StartAction } from './telegram_start_action';
import { CryptocurrenciesAction } from './telegram_cryptocurrencies_action';
import { SubscriptionsAction } from './telegram_subscriptions_action';
import { AboutServiceAction } from './telegram_about_service_action';
import { SettingsAction } from './telegram_settings_action';

import { CommonModule } from '../common/common.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [CommonModule, TelegramModule],
    providers: [StartAction, CryptocurrenciesAction, SubscriptionsAction, AboutServiceAction, SettingsAction],
    exports: [StartAction, CryptocurrenciesAction, SubscriptionsAction, AboutServiceAction, SettingsAction],
})
export class ActionModule { }