import { EventEmitter } from 'events';

export class AppEmitter extends EventEmitter {
  public readonly TELEGRAM_START: string = 'event_telegram_start';
  public readonly TELEGRAM_CRYPTOCURRENCIES: string =
    'event_telegram_cryptocurrencies';
  public readonly TELEGRAM_SUBSCRIPTIONS: string =
    'event_telegram_subscriptions';
  public readonly TELEGRAM_ABOUT_SERVICE: string =
    'event_telegram_about_service';
  public readonly TELEGRAM_SETTINGS: string = 'event_telegram_settings';
  public readonly TELEGRAM_BACK_TO_MAIN_MENU: string =
    'event_telegram_back_to_main_menu';
  public readonly TELEGRAM_CRYPTOCURRENCIES_BASE: string =
    'event_telegram_cryptocurrencies_base';
  public readonly TELEGRAM_CRYPTOCURRENCIES_QUOTE: string =
    'event_telegram_cryptocurrencies_quote';
}
