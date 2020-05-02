import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as ws from 'ws';

import { ListInterface } from './interfaces/list.interface';
import { SymbolInterface } from './interfaces/symbol.interface';

@Injectable()
export class BaseCryptocurrency {
    protected logger: Logger;
    protected stream: any;

    public symbols: SymbolInterface;
    public list: ListInterface = {};

    constructor(logger: Logger) {
        this.logger = logger;
    }

    protected async getExchangeInfo(link: string): Promise<AxiosResponse> {
        try {
            return (await axios.get(link));
        } catch (error) {
            this.logger.error(error);
        }
    }

    protected async getAllMarketTickersStream(link: string): Promise<any> {
        try {
            return new ws(link);
        } catch (error) {
            this.logger.error(error);
        }
    }

    protected async symbolHandler(): Promise<void> {
        throw new Error('not implemented');
    }

    protected async streamHandler(): Promise<void> {
        throw new Error('not implemented');
    }

    public async launch(): Promise<void> {
        await this.symbolHandler();
        await this.streamHandler();
    }
}