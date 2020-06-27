import { Module } from '@nestjs/common';

import { StartAction } from './actions/start.action';
import { CryptocurrenciesAction } from './actions/cryptocurrencies.action';
import { SubscriptionsAction } from './actions/subscriptions.action';
import { AboutAction } from './actions/about.action';
import { SettingsAction } from './actions/settings.action';
import { MenuAction } from './actions/menu.action';
import { BaseAction } from './actions/base.action';
import { QuoteAction } from './actions/quote.action';
import { SubAction } from './actions/sub.action';

import { CryptocurrenciesModule } from '../cryptocurrencies/cryptocurrencies.module';

import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [CommonModule, DatabaseModule, CryptocurrenciesModule],
  providers: [
    StartAction,
    CryptocurrenciesAction,
    SubscriptionsAction,
    AboutAction,
    SettingsAction,
    MenuAction,
    BaseAction,
    QuoteAction,
    SubAction,
  ],
})
export class EventModule {}
