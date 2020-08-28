import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DaysAction } from './actions/days.action';
import { TimeAction } from './actions/time.action';
import { BaseAction } from './actions/base.action';
import { MenuAction } from './actions/menu.action';
import { UnsubAction } from './actions/unsub.action';
import { StartAction } from './actions/start.action';
import { QuoteAction } from './actions/quote.action';
import { SymbolAction } from './actions/symbol.action';
import { OptionsAction } from './actions/options.action';
import { SettingsAction } from './actions/settings.action';
import { LocationAction } from './actions/location.action';
import { LanguageAction } from './actions/language.action';
import { TimeZoneAction } from './actions/time-zone.action';
import { SubscribeAction } from './actions/subscribe.action';
import { SubscriptionsAction } from './actions/subscriptions.action';

import { SubscriptionsScheduledAction } from './scheduled/subscriptions.action';

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
    DaysAction,
    MenuAction,
    TimeAction,
    BaseAction,
    StartAction,
    QuoteAction,
    UnsubAction,
    SymbolAction,
    OptionsAction,
    LocationAction,
    SettingsAction,
    TimeZoneAction,
    LanguageAction,
    SubscribeAction,
    SubscriptionsAction,
    SubscriptionsScheduledAction,
  ],
})
export class EventModule {}
