import { EventEmitter } from 'events';

export class AppEmitter extends EventEmitter {
  public readonly START: string = 'start';
  public readonly CRYPTOCURRENCIES: string = 'cryptocurrencies';
  public readonly SUBSCRIPTIONS: string = 'subscriptions';
  public readonly ABOUT: string = 'about';
  public readonly SETTINGS: string = 'settings';
  public readonly MENU: string = 'menu';
  public readonly BASE: string = 'base';
  public readonly QUOTE: string = 'quote';
  public readonly SUB: string = 'sub';
}
