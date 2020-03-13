import { Module } from '@nestjs/common';

import { StartAction } from './telegram/telegram_start_action';
import { CryptocurrenciesAction } from './telegram/telegram_cryptocurrencies_action';
import { SubscriptionsAction } from './telegram/telegram_subscriptions_action';
import { AboutServiceAction } from './telegram/telegram_about_service_action';
import { SettingsAction } from './telegram/telegram_settings_action';
import { BackToMainMenuAction } from './telegram/telegram_back_to_main_menu_action';
import { CryptocurrenciesBaseAction } from './telegram/telegram_cryptocurrencies_base';

import { CryptocurrenciesModule } from '../cryptocurrencies/cryptocurrencies.module';

import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [CommonModule, DatabaseModule, CryptocurrenciesModule],
    providers: [StartAction, CryptocurrenciesAction, SubscriptionsAction, AboutServiceAction, SettingsAction, BackToMainMenuAction, CryptocurrenciesBaseAction]
})
export class ActionModule { }