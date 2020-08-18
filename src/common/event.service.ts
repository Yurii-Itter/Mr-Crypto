import { EventEmitter } from 'events';

export class EventService extends EventEmitter {
  public readonly MENU = 'menu';
  public readonly BASE = 'base';
  public readonly DAYS = 'days';
  public readonly TIME = 'time';
  public readonly QUOTE = 'quote';
  public readonly UNSUB = 'unsub';
  public readonly ABOUT = 'about';
  public readonly START = 'start';
  public readonly SYMBOL = 'symbol';
  public readonly LOCATION = 'location';
  public readonly TIMEZONE = 'time-zone';
  public readonly SETTINGS = 'settings';
  public readonly SUBSCRIBE = 'subscribe';
  public readonly SUBSCRIPTIONS = 'subscriptions';
  public readonly CRYPTOCURRENCIES = 'cryptocurrencies';
}
