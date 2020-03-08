import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { ChunkInterface } from './interfaces/chunk.interface';
import { ListInterface } from './interfaces/list.interface';
import { BaseInterface } from './interfaces/base.interface';
import { QuoteInterface } from './interfaces/quote.interface';

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

    public getBase(): Array<BaseInterface> {
        let base = this.pairs.map(s => s.base);
        return base.filter((v, i) => base.indexOf(v) === i).sort().map(s => { return { base: s } });
    }

    public getQuote(): Array<QuoteInterface> {
        let quote = this.pairs.map(s => s.quote);
        return quote.filter((v, i) => quote.indexOf(v) === i).sort().map(s => { return { quote: s } });
    }

    public chunkData(basic: Array<BaseInterface | QuoteInterface>, size: number): Array<ChunkInterface> {
        const chunked_arr = [];
        let copied = [...basic];
        const numOfChild = Math.ceil(copied.length / size);
        for (let i = 0; i < numOfChild; i++) {
            chunked_arr.push({ chunk: copied.splice(0, size) });
        }
        return chunked_arr;
    }
}