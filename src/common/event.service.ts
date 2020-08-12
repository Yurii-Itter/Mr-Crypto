import { EventEmitter } from 'events';

export class EventService extends EventEmitter {
  public readonly MENU: string = 'menu';
  public readonly BASE: string = 'base';
  public readonly DAYS: string = 'days';
  public readonly TIME: string = 'time';
  public readonly QUOTE: string = 'quote';
  public readonly UNSUB: string = 'unsub';
  public readonly ABOUT: string = 'about';
  public readonly START: string = 'start';
  public readonly TIMEZONE: string = 'time-zone';
  public readonly SETTINGS: string = 'settings';
  public readonly SUBSCRIBE: string = 'subscribe';
  public readonly SUBSCRIPTIONS: string = 'subscriptions';
  public readonly CRYPTOCURRENCIES: string = 'cryptocurrencies';
}
