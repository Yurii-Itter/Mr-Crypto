import { EventEmitter } from 'events';

export class AppEmitter extends EventEmitter {
    public readonly TELEGRAM_START: string = 'telegram_start';
}