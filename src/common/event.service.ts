import { EventEmitter } from 'events';

export class AppEmitter extends EventEmitter {
    public readonly TELEGRAM_START: string = 'event_telegram_start';
    public readonly TELEGRAM_CRYPTOCURRENCIES: string = 'event_telegram_cryptocurrencies';
    public readonly TELEGRAM_SUBSCRIPTIONS: string = 'event_telegram_subscriptions';
    public readonly TELEGRAM_ABOUT_SERVICE: string = 'event_telegram_about_service';
    public readonly TELEGRAM_SETTINGS: string = 'event_telegram_settings';
}