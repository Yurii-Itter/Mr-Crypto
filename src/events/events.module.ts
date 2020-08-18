import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { StartAction } from './actions/start.action';
import { CryptocurrenciesAction } from './actions/cryptocurrencies.action';
import { SubscriptionsAction } from './actions/subscriptions.action';
import { AboutAction } from './actions/about.action';
import { SettingsAction } from './actions/settings.action';
import { MenuAction } from './actions/menu.action';
import { BaseAction } from './actions/base.action';
import { QuoteAction } from './actions/quote.action';
import { SubscribeAction } from './actions/subscribe.action';
import { SubscriptionsScheduledAction } from './scheduled/subscriptions.action';
import { UnsubAction } from './actions/unsub.action';
import { TimeZoneAction } from './actions/time-zone.action';
import { DayAction } from './actions/day.action';
import { TimeAction } from './actions/time.action';

import { TelegramModule } from '../telegram/telegram.module';
import { ExchangeModule } from '../exchanges/exchange.module';

import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    ExchangeModule,
    TelegramModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    StartAction,
    CryptocurrenciesAction,
    SubscriptionsScheduledAction,
    SubscriptionsAction,
    AboutAction,
    SettingsAction,
    MenuAction,
    BaseAction,
    QuoteAction,
    SubscribeAction,
    TimeZoneAction,
    DayAction,
    TimeAction,
    UnsubAction,
  ],
})
export class EventModule {}
