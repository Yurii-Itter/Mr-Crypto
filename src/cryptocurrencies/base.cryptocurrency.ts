import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { ListInterface } from './interfaces/list.interface';

@Injectable()
export class BaseCryptocurrency {
    protected logger: Logger;
    protected pairs: Array<ListInterface>;

    constructor(logger: Logger) {
        this.logger = logger;

        this.setPairs();
    }

    protected async getExchangeInfo(link: string): Promise<Array<any>> {
        try {
            return (await axios.get(link)).data.symbols;
        } catch (error) {
            this.logger.error(error);
        }
    }

    protected async setPairs(): Promise<void> {
        throw new Error('not implemented');
    }

    protected formatData(data: Array<any>): Array<ListInterface> {
        throw new Error('not implemented');
    }

    public getBase(): Array<String> {
        let base = this.pairs.map(s => s.base);
        return base.filter((v, i) => base.indexOf(v) === i).sort();
    }

    public getQuote(base: string): Array<String> {
        let quote = this.pairs.filter(f => f.base === base).map(s => s.quote);
        return quote.filter((v, i) => quote.indexOf(v) === i).sort();
    }
}